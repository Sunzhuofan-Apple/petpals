import googlemaps
from .models import Pet
from openai import OpenAI
import regex
import json
from datetime import datetime
from django.conf import settings
from pathlib import Path
from django.core.serializers import serialize

BASE_DIR = Path(__file__).resolve().parent.parent
file_path = BASE_DIR / "data" / "pets_data.json"

# --- tools methods ---
def calculate_distance(start, end):
    gmaps = googlemaps.Client(key=settings.GOOGLE_MAPS_API_KEY)
    distance = gmaps.distance_matrix(start, end)
    return distance['rows'][0]['elements'][0]['distance']['value'] / 1609.34 # convert to miles

def calculate_age(birth_date):
    today = datetime.now()
    years = today.year - birth_date.year
    months = today.month - birth_date.month
    days = today.day - birth_date.day

    if months < 0:
        years -= 1
        months += 12

    if days < 0:
        months -= 1

    if years == 0:
        return f"{months} month{'s' if months > 1 else ''}"

    return f"{years} year{'s' if years > 1 else ''}, {months} month{'s' if months > 1 else ''}"

# --- filters rules ---
def filter_by_time_range(pets, target_time):
    valid_choices = [choice[0] for choice in Pet._meta.get_field('preferred_time').choices]

    if target_time not in valid_choices:
        raise ValueError(f"Invalid time choice: {target_time}")
    
    target_index = valid_choices.index(target_time)

    filtered_pets = [
        pet_data for pet_data in pets
        if abs(valid_choices.index(pet_data['preferred_time']) - target_index) <= 1
    ]
    return filtered_pets


def filter_by_health_state(pets, target_states):
    required_states = ["rabies", "influenza", "dhlpp"]
    missing_states = [state for state in required_states if state not in target_states]
    filtered_pets = [
        pet_data for pet_data in pets
        if all(state in pet_data["health_states"] for state in missing_states)
    ]
    return filtered_pets

def filter_by_hard_red_flags(pets, target_pet):
    filtered_pets = pets
    # "Big Dog"
    red_flags = target_pet["red_flags"]
    print("red_flags: ", red_flags)
    if "Big Dog" in red_flags:
        filtered_pets = [
            pet_data for pet_data in filtered_pets
            if pet_data["weight"] <= 55
        ]
        print("finished filtering Big Dog")
    # "Not Good with Smaller Dogs"
    if "Not Good with Smaller Dogs" in red_flags:
        filtered_pets = [
            pet_data for pet_data in filtered_pets
            if pet_data["weight"] >= 22
        ]
        print("finished filtering Not Good with Smaller Dogs")
    # "Not Neutered"
    if "Not Neutered" in red_flags:
        filtered_pets = [
            pet_data for pet_data in filtered_pets if pet_data["sex"] == "Neutered"
        ]
        print("finished filtering Not Neutered")
    return filtered_pets

def apply_filters(pets, target_pet):
    filtered_pets = pets
    print("numbers of filtering pets: ", len(filtered_pets))
    filtered_pets = filter_by_time_range(pets, target_pet["preferred_time"])
    print("finished filter_by_time_range, reduced to: ", len(filtered_pets))
    # filtered_pets = filter_by_health_state(filtered_pets, target_pet["health_states"])
    # print("finished filter_by_health_state, reduced to: ", len(filtered_pets))
    filtered_pets = filter_by_hard_red_flags(filtered_pets, target_pet)
    print("finished filter_by_hard_red_flags, reduced to: ", len(filtered_pets))
    print("numbers of filtering pets: ", len(filtered_pets))
    return filtered_pets

# --- GPT-4o methods ---
def get_full_prompt(target_pet, pets_data):
    target_pet = json.dumps(target_pet, indent=4)
    pets_data = json.dumps(pets_data, indent=4)
    return f"""
    Return Format:
    [
        {{
            "id": "pet id",
            "score": "total score",
            "reason": "reason for the score"
        }},
        ...
    ]

    Note:
    - Return only the JSON object for easy parsing.
    - For each entry, ensure provide: id, score and reason.

    Rules:
    Please sort the following pets for the targeted pet by calculating a total score based on the following criteria:
    1. The score is between 0.0 and 100.0, with higher scores indicating a better match. The following situations will help higher scores:
    - Same or similar breed adds 10.0 to 20.0 points.
    - Same preferred time add 10.0 points.
    - The more sharing or similar characters, the higher the score. Adds 0.0 to 20.0 points.
    - The closer the location, the higher the score, adding points from 0.0 to 20.0. If the city is not the same, the score will be reduced by 20.0 points.
    - According to the red flags, focus on the targeted pet's red flags. If the characters or other attributes of a pet matches the targeted pet's red flags, the score will be reduced. The more things match, the lower the score. The score will be reduced by 0.0 to 20.0 points.Do not compare one's red flags with another's red flags!!!
    - Provide a **detailed explanation** for each score, including:
        - Matching or similar characters.
        - Location relevance (same area or not).
        - Mention which character or characters conflicts with targeted dog's red flags and how they affected the score.
    - Return pets from high score to low and resolve ties in score by prioritizing pets with fewer red flags.
    2. The total score should be rounded to one decimal place, from 0.0 to 100.0, not too tidy with the data.

    About "red flags":
    - "Red flags" do not describe the attributes of a pet itself.
    - Instead, they indicate behaviors or attributes that mean the pet does not want to interact with other pets having those attributes.
    - For example, a red flag "Big Dog" on a pet means the pet does not prefer to play with larger dogs.

    The targeted pet's information is as follows:
    {target_pet}

    The pets to consider for friendship are as follows:
    {pets_data}

    Return the filtered and prioritized result strictly in the JSON format specified above.
    """

def get_model_json(model_name: str, fullcode:str, stream: bool = False):
    print("ready to call openai")
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    response = client.chat.completions.create(
        model=model_name,
        messages = [
            {
                "role": "user",
                "content": fullcode
            }
        ],
        stream=stream
    )

    if stream:
        for chunk in response:
            print(chunk)
    else:
        return response

def ask(target_pet, pets_data):
    fullcode = get_full_prompt(target_pet, pets_data)
    response = get_model_json("gpt-3.5-turbo-0125", fullcode) # alternative: gpt-4o-mini, gpt-4o
    string = response.choices[0].message.content

    try:
            json_load = json.loads(string)
            
            # if JSON parsing is successful, save the result and return
            if isinstance(json_load, list):
                # with open('gpt_result.json', 'w') as f:
                #     json.dump(json_load, f, indent=4)
                return json_load
            else:
                print("Parsed JSON is not a list. Proceeding with regex extraction.")
    except json.JSONDecodeError:
        print("Direct JSON parsing failed. Proceeding with regex extraction.")
    
    # if JSON parsing failed, use regex to extract JSON objects
    pattern = regex.compile(r'\{(?:[^{}]|(?R))*\}')
    matches = pattern.findall(string)
    
    # parse each JSON object and save the result
    json_load = []
    for match in matches:
        try:
            json_obj = json.loads(match)
            json_load.append(json_obj)
        except json.JSONDecodeError as e:
            print(f"Failed to parse JSON object: {e}")
        
        # save the result for debug
        # with open('gpt_result.json', 'w') as f:
        #     json.dump(json_load, f, indent=4)
    
    return json_load

# --- process results ---
def id_to_display(matching_pets, target_pet, user_id):
    pet_details = []
    # if isinstance(target_pet, str):
    #     target_pet = json.loads(target_pet)
    # if isinstance(target_pet, list) and len(target_pet) > 0:
    #     pet = target_pet[0]
    #     if isinstance(pet, dict) and "fields" in pet:
    #         cleaned_target_pet = pet["fields"]
    
        
    target_location = target_pet["location"]

    # for database data
    for pet_data in matching_pets:
        try:
            pet_id = pet_data["id"]
            score = pet_data["score"]
            reason = pet_data["reason"]
            
            pet = Pet.objects.get(id=pet_id)
            print(f"pet {pet_id}", pet)
            # print(f"pet {pet_id}", pet, score, reason)

            pet_location = pet.location
            distance = calculate_distance(target_location, pet_location)

            pet_details.append({
                "id": pet.id,
                "name": pet.name,
                "breed": pet.breed,
                "age": (datetime.now().date() - pet.birth_date).days // 365,
                "weight": pet.weight,
                "distance": round(distance, 1),
                "photos": pet.photos,
                "matchScore": score,
                "reason": reason,
                "isFollowing": pet.followers.filter(id=user_id).exists()
            })

        except Pet.DoesNotExist:
            print(f"Pet with ID {pet_id} does not exist.")
        except Exception as e:
            print(f"Error processing pet with ID {pet_id}: {e}")
    return pet_details

# --- main method ---
def process_target_pet(target_pet_id, user_id):
    try:
        # with open(file_path, 'r') as f:
        #     pets_data = json.load(f)
        # combile database
        # pets_data = pets_data + list(Pet.objects.all().values())
        target_pet = serialize('json', Pet.objects.filter(id=target_pet_id))
        target_pet = json.loads(target_pet)
        pet = target_pet[0]
        target_pet = pet["fields"]
        
        pets_data = serialize('json', Pet.objects.exclude(id=target_pet_id))
        pets_data = json.loads(pets_data)
        fields_with_id = []
        for pet in pets_data:
            if "fields" in pet:
                pet_data = pet["fields"].copy()
                pet_data["id"] = pet["pk"]
                fields_with_id.append(pet_data)

        filtered_pets = fields_with_id

        filtered_pets = apply_filters(filtered_pets, target_pet)
        gpt_result = ask(target_pet, filtered_pets)
        
        detailed_results = id_to_display(gpt_result, target_pet, user_id)
        return detailed_results
    except Exception as e:
        print(f"Error processing target pet: {e}")
        return []
import googlemaps
from .models import Pet
from openai import OpenAI
import regex
import json
from datetime import datetime
from django.conf import settings
from pathlib import Path

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

    filtered_pets = {
        pet_id: pet_data
        for pet_id, pet_data in pets.items()
        if abs(valid_choices.index(pet_data['preferred_time']) - target_index) <= 1
    }
    return filtered_pets


def filter_by_health_state(pets, target_states):
    required_states = ["rabies", "influenza", "dhlpp"]
    missing_states = [state for state in required_states if state not in target_states]
    filtered_pets = {
        pet_id: pet_data
        for pet_id, pet_data in pets.items()
        if all(state in pet_data["health_states"] for state in missing_states)
    }
    return filtered_pets

def filter_by_hard_red_flags(pets, target_pet):
    filtered_pets = pets
    # "Big Dog"
    red_flags = target_pet["red_flags"]
    print("red_flags: ", red_flags)
    if "Big Dog" in red_flags:
        filtered_pets = {
            pet_id: pet_data
            for pet_id, pet_data in filtered_pets.items()
            if pet_data["weight"] <= 55
        }
        print("finished filtering Big Dog")
    # "Not Good with Smaller Dogs"
    if "Not Good with Smaller Dogs" in red_flags:
        filtered_pets = {
            pet_id: pet_data
            for pet_id, pet_data in filtered_pets.items()
            if pet_data["weight"] >= 22
        }
        print("finished filtering Not Good with Smaller Dogs")
    # "Not Neutered"
    if "Not Neutered" in red_flags:
        filtered_pets = {
            pet_id: pet_data
            for pet_id, pet_data in filtered_pets.items()
            if pet_data["sex"] == "Neutered"
        }
        print("finished filtering Not Neutered")
    return filtered_pets

def apply_filters(pets, target_pet):
    filtered_pets = pets
    print("numbers of filtering pets: ", len(filtered_pets))
    filtered_pets = filter_by_time_range(pets, target_pet["preferred_time"])
    print("finished filter_by_time_range")
    filtered_pets = filter_by_health_state(filtered_pets, target_pet["health_states"])
    print("finished filter_by_health_state")
    filtered_pets = filter_by_hard_red_flags(filtered_pets, target_pet)
    print("finished filter_by_hard_red_flags")
    print("numbers of filtering pets: ", len(filtered_pets))
    return filtered_pets

# --- GPT-4o methods ---
def get_full_prompt(target_pet, pets_data):
    target_pet = json.dumps(target_pet, indent=4)
    pets_data = json.dumps(pets_data, indent=4)
    return f"""
    Return Format:
    [
        "pet id": {{
            "score": "total score",
            "reason": "reason for the score"
        }},
        ...
    ]

    Note:
    - Return only the JSON object for easy parsing.
    - Each pet is identified by its "pet id", which serves as the top-level key.
    - For each "pet id", ensure provide: score and reason.

    Rules:
    Please sort the following pets for the targeted pet by calculating a total score based on the following criteria:
    1. Same or similar breed as the targeted pet adds +3 points.
    2. Each matching or similar characteristic adds +2 points.
    3. Pets located in the same area as the targeted pet add +2 points.
    4. If the character of another pet conflicts with any of the targeted pet's red flags, subtracts -3 points.
    5. Provide a **detailed explanation** for each score, including:
    - Matching or similar characteristics.
    - Location relevance (same area or not).
    - Mention which character or characters conflicts with targeted dog's red flags and how they affected the score.
    6. Return pets from high score to low and resolve ties in score by prioritizing pets with fewer red flags.

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
    print("model_name", model_name)
    print("fullcode", fullcode)
    print("stream", stream)
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
    response = get_model_json("gpt-3.5-turbo", fullcode)
    string = response.choices[0].message.content
    print("pet string", string)
    pattern = regex.compile(r'\{(?:[^{}]|(?R))*\}')
    a = pattern.findall(string)
    json_load =  json.loads(a[0])

    with open('gpt_result.json', 'w') as f:
        json.dump(json_load, f, indent=4)
    
    return json_load

# --- process results ---
def id_to_display(json_load, target_pet):
    pet_details = []
    target_location = target_pet["location"]
    print("ready to process json_load")

    for pet_id, pet_data in json_load.items():
        try:
            score = pet_data["score"]
            reason = pet_data["reason"]

            with open(file_path, 'r') as f:
                pets_data = json.load(f)
            
            pet = pets_data[pet_id]

            print("ready to process pet")

            name = pet["name"]
            breed = pet["breed"]
            birth_date = datetime.strptime(pet["birth_date"], '%Y-%m-%d')
            weight = pet["weight"]
            pet_location = pet["location"]
            photo = pet.get("photo")
            
            # pet = Pet.objects.get(id=pet_id)

            age = calculate_age(birth_date)
            distance = calculate_distance(target_location, pet_location)

            pet_details.append({
                "id": pet_id,
                "name": name,
                "breed": breed,
                "age": age,
                "weight": weight,
                "distance": round(distance, 2),
                "photo": photo,
                "score": score,
                "reason": reason,
            })

            print("add pet" + pet_id + name)
            
            # pet_location = pet.location
            # distance = calculate_distance(target_location, pet_location)

            # pet_details.append({
            #     "id": pet.id,
            #     "name": pet.name,
            #     "breed": pet.breed,
            #     "age": age,
            #     "weight": pet.weight,
            #     "distance": round(distance, 2),
            #     "photo": pet.photo.url if pet.photo else None,
            #     "score": score,
            #     "reason": reason,
            # })

        except Pet.DoesNotExist:
            print(f"Pet with ID {pet_id} does not exist.")
        except Exception as e:
            print(f"Error processing pet with ID {pet_id}: {e}")
    return pet_details

# --- main method ---
def process_target_pet(target_pet):
    try:
        with open(file_path, 'r') as f:
            pets_data = json.load(f)
        # combile database
        # pets_data = pets_data + list(Pet.objects.all().values())
        print("finished reading pets_data")
        filtered_pets = pets_data
        # filtered_pets = apply_filters(pets_data, target_pet)
        gpt_result = ask(target_pet, filtered_pets)
        detailed_results = id_to_display(gpt_result, target_pet)
        return detailed_results
    except Exception as e:
        print(f"Error processing target pet: {e}")
        return []
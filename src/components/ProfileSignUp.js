import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "../styles/ProfileSignUp.css";
import "../styles/AddPhoto.css";
import protectRedirect from "./protectRedirect";
import getCSRFToken from "./getCSRFToken";
import "../styles/RedFlags.css"; 
import loadGoogleMapsAPI from '../utils/loadGoogleMapsAPI';

const sexOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" }
];

const timeOptions = [
    { value: "morning", label: "Morning" },
    { value: "afternoon", label: "Afternoon" },
    { value: "evening", label: "Evening" }
];


const charactersList = [
    { id: 1, name: "Calm", description: "Peaceful and relaxed temperament" },
    { id: 2, name: "Active", description: "High energy and playful" },
    { id: 3, name: "Love Sleep", description: "Enjoys resting and relaxing" },
    { id: 4, name: "Friendly", description: "Gets along well with others" },
    { id: 5, name: "Independent", description: "Self-reliant and confident" },
    { id: 6, name: "Protective", description: "Watchful and loyal" },
    { id: 7, name: "Curious", description: "Loves exploring new things" },
    { id: 8, name: "Gentle", description: "Soft and careful with others" },
    { id: 9, name: "Playful", description: "Always ready for fun" },
    { id: 10, name: "Social", description: "Loves meeting new friends" }
];

const redFlagsList = [
    { id: 1, name: "Not Active Dog", description: "Dogs with low energy levels" },
    { id: 2, name: "Play at Night", description: "Dogs that are active during night time" },
    { id: 3, name: "Big Dog", description: "Large sized dogs" },
    { id: 4, name: "Aggressive", description: "Dogs showing aggressive behavior" },
    { id: 5, name: "Not Neutered", description: "Dogs that haven't been neutered" },
    { id: 6, name: "Barks a Lot", description: "Dogs that bark frequently" },
    { id: 7, name: "Too Energetic", description: "Dogs with excessive energy" },
    { id: 8, name: "Not Good with Small Dogs", description: "Dogs that don't get along with smaller dogs" },
    { id: 9, name: "Resource Guarding", description: "Dogs that guard food or toys" },
    { id: 10, name: "Not Socialized", description: "Dogs that haven't been well socialized" },
    { id: 11, name: "Separation Anxiety", description: "Dogs that get anxious when left alone" },
    { id: 12, name: "Not Trained", description: "Dogs without basic training" }
];


const ProfileSignUp = () => {
    const navigate = useNavigate();
    const [shouldRender, setShouldRender] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); 
    const [isLoading, setIsLoading] = useState(true); 
    const [formData, setFormData] = useState({
        name: "",
        sex: "",
        preferred_time: "",
        breed: "",
        birth_date: "",
        location: "",
        weight: "",
        health_states: [],
        characters: [],
        red_flags: [],
        photos: []
    });
    
    const [photos, setPhotos] = useState(Array(6).fill(null));
    const [selectedCharacters, setSelectedCharacters] = useState([]);

    const handleCharacterSelect = (character) => {
        if (selectedCharacters.includes(character)) {
            setSelectedCharacters((prev) => prev.filter((c) => c !== character));
        } else if (selectedCharacters.length < 3) {
            setSelectedCharacters((prev) => [...prev, character]);
        }
    };
    const [selectedFlags, setSelectedFlags] = useState([]);

    const handleFlagSelect = (flag) => {
        if (selectedFlags.includes(flag)) {
            setSelectedFlags((prev) => prev.filter((f) => f !== flag));
        } else if (selectedFlags.length < 3) {
            setSelectedFlags((prev) => [...prev, flag]);
        }
    };

    const fileInputRef = useRef(null);
    const locationInputRef = useRef(null);
    const [googleAPILoaded, setGoogleAPILoaded] = useState(false);
    const [autocomplete, setAutocomplete] = useState(null);

    useEffect(() => {
        const path = "/ProfileSignUp";
        const from = new URLSearchParams(window.location.search).get('from');
        
        if (from === 'MyProfile') {
            setShouldRender(true);
            return;
        }
        const isRedirectNeeded = protectRedirect(path, path);
        if (!isRedirectNeeded) {
            setShouldRender(true);
        }
    }, []);

    const [errors, setErrors] = useState({
        name: '',
        weight: '',
        birth_date: ''
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        
        // 处理不同字段的输入限制
        let finalValue = value;
        let error = '';

        switch (name) {
            case 'name':
                if (formData.name.length >= 20 && value.length > 20) {
                    finalValue = formData.name;
                    error = 'Name must be less than 20 characters';
                } else {
                    finalValue = value.slice(0, 20);
                    if (finalValue.length === 20) {
                        error = 'Name must be less than 20 characters';
                    }
                }
                break;

            case 'weight':
                const weightNum = parseFloat(value);
                if (weightNum > 200) {
                    finalValue = "200";
                    error = 'Weight must be less than 200 lbs';
                }
                break;
            case 'location':
                if (value && value.length > 100) {
                    error = 'Location is too long';
                } else if (value && !/^[a-zA-Z0-9\s,.-]+$/.test(value)) {
                    error = 'Please use English characters for location';
                }
                break;
            case 'birth_date':
                const year = new Date(value).getFullYear();
                if (year > 2024) {
                    error = 'Birth year cannot be later than 2024';
                    finalValue = '';
                }
                break;
        }

        setFormData(prevState => ({
            ...prevState,
            [name]: finalValue,
        }));

        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };
    

    useEffect(() => {
        const checkPetExists = async () => {
            const from = new URLSearchParams(window.location.search).get('from');
            
            if (from === 'MyProfile') {
                setShouldRender(true);
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/check-pet-exists/`, {
                    method: "GET",
                    credentials: "include",
                });
    
                if (!response.ok) throw new Error("Failed to check pet existence");
    
                const data = await response.json();
    
                if (data.has_pet) {
                    navigate("/Matching");
                } else {
                    setShouldRender(true);
                }
            } catch (error) {
                console.error("Error checking pet existence:", error);
                navigate("/login");
            } finally {
                setIsLoading(false);
            }
        };
    
        console.log("Checking pet existence...");
        checkPetExists(); // 调用检查函数
    }, [navigate]);
    
    
    

    const handleSelectChange = (selectedOptions) => {
        const healthStates = selectedOptions.map((option) => option.value);
        setFormData({
            ...formData,
            health_states: healthStates
        });
    };

    // 上传照片事件处函数
    const handlePhotoUpload = async (event) => {
        const files = event.target.files;
        const formData = new FormData();
    
        Array.from(files).forEach((file) => {
            formData.append("photos", file);
        });
    
        try {
            const csrfToken = getCSRFToken();
            const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/upload-photos/`, {
                method: "POST",
                headers: {
                    "X-CSRFToken": csrfToken,
                },
                credentials: 'include',
                body: formData, // 上传文件
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log("Uploaded photo URLs:", data.photos);
                setPhotos(data.photos); // 更新照片 URL
            } else {
                console.error("Failed to upload photos.");
            }
        } catch (error) {
            console.error("Photo upload error:", error);
        }
    };
    

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleDeletePhoto = (index) => {
        const updatedPhotos = photos.filter((photo, i) => i !== index).concat(null);
        setPhotos(updatedPhotos);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (formData.health_states.length === 0) {
            alert("Health states cannot be empty.");
            return;
        }
        if (selectedCharacters.length === 0) {
            alert("Please select at least one character.");
            return;
        }
        if (selectedFlags.length === 0) {
            alert("Please select at least one red flag.");
            return;
        }
    
        const payload = {
            ...formData,
            health_states: formData.health_states,
            characters: selectedCharacters.map(c => c.name),
            red_flags: selectedFlags.map(f => f.name),
            photos: photos.filter(p => p !== null)
        };
    
        try {
            const csrfToken = getCSRFToken();
            const from = new URLSearchParams(window.location.search).get('from');
            
            const response = await fetch(
                from === 'MyProfile' 
                    ? `${process.env.REACT_APP_BACKEND}/api/update-pet/`
                    : `${process.env.REACT_APP_BACKEND}/api/ProfileSignUp/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": csrfToken,
                    },
                    credentials: 'include',
                    body: JSON.stringify(payload),
                }
            );

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Server returned non-JSON response");
            }

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || "Failed to update profile");
            }

            alert(from === 'MyProfile' 
                ? "Pet profile updated successfully!"
                : "Pet profile created successfully!");
            window.location.href = '/MyProfile';
        } catch (error) {
            console.error("Fetch error:", error);
            if (error.message === "Server returned non-JSON response") {
                alert("Server error. Please try again later.");
            } else {
                alert(error.message || "Error submitting profile. Please try again.");
            }
        }
    };
    
    

    // 切换页面
    const handleNext = () => {
        // 在第一页时进行表单验证
        if (currentPage === 1) {
            const requiredFields = ['name', 'birth_date', 'breed', 'sex', 'weight', 'location'];
            const hasEmptyFields = requiredFields.some(field => !formData[field]);
            const hasErrors = Object.values(errors).some(error => error);

            if (hasEmptyFields) {
                alert('Please fill in all required fields');
                return;
            }

            if (hasErrors) {
                alert('Please correct the errors before proceeding');
                return;
            }
        }
        
        setCurrentPage(prev => prev + 1);
    };
    const handlePrevious = () => setCurrentPage((prevPage) => prevPage - 1);

    useEffect(() => {
        console.log('Loading Google Maps API...');
        loadGoogleMapsAPI()
            .then(() => {
                console.log('Google Maps API loaded successfully');
                setGoogleAPILoaded(true);
            })
            .catch(error => {
                console.error('Failed to load Google Maps API:', error);
            });
    }, []);

    useEffect(() => {
        console.log('googleAPILoaded changed:', googleAPILoaded);
        if (googleAPILoaded) {
            initializeAutocomplete();
        }
    
        return () => {
            if (autocomplete) {
                console.log('Cleaning up autocomplete listeners');
                window.google?.maps?.event?.clearInstanceListeners(autocomplete);
            }
        };
    }, [googleAPILoaded]);

    const initializeAutocomplete = async () => {
        console.log('Initializing autocomplete...');
        try {
            const maps = await loadGoogleMapsAPI();
            console.log('Maps object received:', !!maps);
            
            if (locationInputRef.current && !autocomplete) {
                console.log('Creating new autocomplete instance');
                const newAutocomplete = new maps.places.Autocomplete(locationInputRef.current, {
                    types: ['address'],
                    fields: [
                        'formatted_address',
                        'address_components',
                        'geometry'
                    ],
                    language: 'en',
                    componentRestrictions: { country: 'us' }
                });

                newAutocomplete.addListener('place_changed', () => {
                    console.log('Place selected');
                    const place = newAutocomplete.getPlace();
                    console.log('Selected place:', place);
                    if (place.formatted_address) {
                        setFormData(prevData => ({
                            ...prevData,
                            location: place.formatted_address
                        }));
                    }
                });

                setAutocomplete(newAutocomplete);
                console.log('Autocomplete initialized successfully');
            } else {
                console.log('Skipping autocomplete initialization:', {
                    hasInput: !!locationInputRef.current,
                    hasExistingAutocomplete: !!autocomplete
                });
            }
        } catch (error) {
            console.error('Error initializing Google Maps:', error);
        }
    };

    useEffect(() => {
        const from = new URLSearchParams(window.location.search).get('from');
        
        if (from === 'MyProfile') {
            const fetchExistingPetData = async () => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/user-pet/`, {
                        method: "GET",
                        credentials: "include",
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setFormData({
                            name: data.name || "",
                            sex: data.sex || "",
                            preferred_time: data.preferred_time || "",
                            breed: data.breed || "",
                            birth_date: data.birth_date || "",
                            location: data.location || "",
                            weight: data.weight || "",
                            health_states: data.health_states || [],
                            photos: data.photos || Array(6).fill(null)
                        });
                        
                        const existingCharacters = charactersList.filter(char => 
                            data.characters.includes(char.name)
                        );
                        setSelectedCharacters(existingCharacters);
                        
                        const existingFlags = redFlagsList.filter(flag => 
                            data.red_flags.includes(flag.name)
                        );
                        setSelectedFlags(existingFlags);
                        
                        setPhotos(data.photos || Array(6).fill(null));
                    }
                } catch (err) {
                    console.error("Error fetching existing pet data:", err);
                }
            };

            fetchExistingPetData();
        }
    }, []);

    if (!shouldRender) return null;
    if (isLoading) {
        console.log("Page is loading...");
        return <div>Loading...</div>;
    }
    if (!shouldRender) {
        console.log("User already has a pet, redirecting...");
        return null;
    }
    
  
    return (
        <div>
            <header className="AppHeader">
                <button className="header-button" onClick={() => window.location.href = "/"}>
                    Home
                </button>
            </header>
            <div className="profile-signup">
                {currentPage === 1 && (
                    <div className="form-container">
                        <div className="profile-title-container">
                            <div className="profile-title">Profile Sign Up</div>
                            <div className="profile-paw-print">
                                <div className="profile-paw-image">
                                    <img src={`${process.env.PUBLIC_URL}/image/g3023.svg`} alt="Paw Print" />
                                </div>
                            </div>
                        </div>
                        <form className="form-grid">
                            <label>
                                Pet Name:
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    maxLength="20"
                                    className={`input-field ${errors.name ? 'error' : ''}`}
                                    placeholder="Enter pet's name"
                                />
                                {errors.name && <div className="error-text">{errors.name}</div>}
                            </label>
                            <label>
                                Birth Date:
                                <input
                                    type="date"
                                    name="birth_date"
                                    value={formData.birth_date}
                                    onChange={handleInputChange}
                                    className={`input-field ${errors.birth_date ? 'error' : ''}`}
                                />
                                {errors.birth_date && <div className="error-text">{errors.birth_date}</div>}
                            </label>
                            <label>
                                Breed:
                                <input
                                    type="text"
                                    name="breed"
                                    value={formData.breed}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    placeholder="Enter breed"
                                />
                            </label>
                            <label>
                                Location:
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    placeholder="Enter location"
                                    ref={locationInputRef}
                                    autoComplete="off"
                                />
                                {errors.location && <span className="error-text">{errors.location}</span>}
                            </label>
                            <label>
                                Sex:
                                <select
                                    name="sex"
                                    value={formData.sex}
                                    onChange={handleInputChange}
                                    className="input-field"
                                >
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Neutered">Neutered</option>
                                </select>
                            </label>
                            <label>
                                Preferred Time:
                                <select
                                    name="preferred_time"
                                    value={formData.preferred_time}
                                    onChange={handleInputChange}
                                    className="input-field"
                                >
                                    <option value="">Select</option>
                                    <option value="Morning">Morning</option>
                                    <option value="Midday">Midday</option>
                                    <option value="Afternoon">Afternoon</option>
                                    <option value="Evening">Evening</option>
                                </select>
                            </label>
                            <label>
                                Weight (LBS):
                                <input
                                    type="number"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleInputChange}
                                    max="200"
                                    className={`input-field ${errors.weight ? 'error' : ''}`}
                                    placeholder="Enter weight"
                                />
                                {errors.weight && <div className="error-text">{errors.weight}</div>}
                            </label>
                            <label>
                                Health State:
                                <Select
                                    isMulti
                                    options={[
                                        { value: "rabies", label: "Rabies" },
                                        { value: "dhlpp", label: "DHLPP" },
                                        { value: "bordetella", label: "Bordetella" },
                                        { value: "heartworm", label: "Heartworm Prevention" },
                                        { value: "lyme", label: "Lyme Disease" },
                                        { value: "leptospirosis", label: "Leptospirosis" },
                                        { value: "influenza", label: "Canine Influenza" }
                                    ]}
                                    onChange={handleSelectChange}
                                    classNamePrefix="select"
                                    placeholder="Select health state"
                                />
                                
                            </label>
                        </form>
                        <div className="button-container">
                            <button type="button" className="next-button" onClick={handleNext}>
                                Next
                            </button>
                        </div>
                    </div>
                )}
                {currentPage === 2 && (
                    <div className="adding-photos">
                        <div className="profile-title-container">
                            <div className="profile-title">Adding photos for your pet!</div>
                            <div className="profile-paw-print">
                                <div className="profile-paw-image">
                                    <img src={`${process.env.PUBLIC_URL}/image/g3023.svg`} alt="Paw Print" />
                                </div>
                            </div>
                        </div>
                        <div className="photo-grid">
                            {photos.map((photo, index) => (
                                <div className="photo-frame" key={index}>
                                    {photo ? (
                                        <div className="photo-container">
                                            <img src={photo} alt={`Pet ${index + 1}`} className="photo" />
                                            <button
                                                className="delete-button"
                                                onClick={() => handleDeletePhoto(index)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <button className="add-photo-button" onClick={triggerFileInput}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <p className="photo-count">{photos.filter((photo) => photo !== null).length}/6</p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="upload-input"
                        />
                        <div className="button-container">
                            <button type="button" className="next-button" onClick={handlePrevious}>
                                Previous
                            </button>
                            <button type="button" className="next-button" onClick={handleNext}>
                                Next
                            </button>
                        </div>
                    </div>
                )}
           {/* Page3: Characters */}
                {currentPage === 3 && (
                    <div className="characters-page">
                        <div className="profile-title-container">
                            <div className="profile-title">Select Your Pet's Character</div>
                            <div className="profile-paw-print">
                                <div className="profile-paw-image">
                                    <img src={`${process.env.PUBLIC_URL}/image/g3023.svg`} alt="Paw Print" />
                                </div>
                            </div>
                        </div>
                        <div className="character-grid">
                            {charactersList.map((character) => (
                                <button
                                    key={character.id}
                                    className={`character-card ${
                                        selectedCharacters.includes(character) ? "selected" : ""
                                    } ${
                                        selectedCharacters.length >= 3 &&
                                        !selectedCharacters.includes(character) ? "disabled" : ""
                                    }`}
                                    onClick={() => handleCharacterSelect(character)}
                                >
                                    <span className="character-name">{character.name}</span>
                                </button>
                            ))}
                        </div>
                        <p className="selection-counter">{selectedCharacters.length}/3</p>
                        <div className="button-container">
                            <button type="button" className="next-button" onClick={handlePrevious}>
                                Previous
                            </button>
                            <button type="button" className="next-button" onClick={handleNext}>
                                Next
                            </button>
                        </div>
                    </div>
                )}
            {/* Page4: Red Flags */}
                {currentPage === 4 && (
                    <div className="redflags-page">
                        <div className="profile-title-container">
                            <div className="profile-title">Red Flags</div>
                            <div className="profile-paw-print">
                                <div className="profile-paw-image">
                                    <img src={`${process.env.PUBLIC_URL}/image/g3023.svg`} alt="Paw Print" />
                                </div>
                            </div>
                        </div>
                        <div className="flag-grid">
                            {redFlagsList.map((flag) => (
                                <button
                                    key={flag.id}
                                    className={`flag-card ${
                                        selectedFlags.includes(flag) ? "selected" : ""
                                    } ${
                                        selectedFlags.length >= 3 &&
                                        !selectedFlags.includes(flag) ? "disabled" : ""
                                    }`}
                                    onClick={() => handleFlagSelect(flag)}
                                >
                                    <span className="flag-name">{flag.name}</span>
                                </button>
                            ))}
                        </div>
                        <p className="selection-counter">{selectedFlags.length}/3</p>
                        <div className="button-container">
                            <button type="button" className="next-button" onClick={handlePrevious}>
                                Previous
                            </button>
                            <button type="button" className="next-button" onClick={handleSubmit}>
                                Submit
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileSignUp;
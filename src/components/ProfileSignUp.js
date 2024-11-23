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

    const validateInput = (name, value) => {
        let error = '';
        switch (name) {
            case 'name':
                if (value.length > 20) {
                    error = 'Pet name cannot exceed 20 characters';
                } else if (value && !/^[a-zA-Z0-9\s-]+$/.test(value)) {
                    error = 'Pet name can only contain letters, numbers, spaces and hyphens';
                }
                break;
            case 'weight':
                if (value === '') {
                    error = '';
                } else {
                    const weightNum = parseFloat(value);
                    if (isNaN(weightNum)) {
                        error = 'Please enter a valid number';
                    } else if (weightNum < 1) {
                        error = 'Weight must be at least 1 LB';
                    } else if (weightNum > 200) {
                        error = 'Weight cannot exceed 200 LBS';
                    }
                }
                break;
            case 'birth_date':
                if (value) {
                    const date = new Date(value);
                    const year = date.getFullYear();
                    const currentYear = new Date().getFullYear();
                    if (year > currentYear) {
                        error = 'Birth year cannot be in the future';
                    } else if (year < currentYear - 30) {
                        error = 'Please enter a valid birth year';
                    }
                }
                break;
            case 'breed':
                if (value && value.length > 30) {
                    error = 'Breed name is too long';
                }
                break;
            case 'location':
                if (value && value.length > 100) {
                    error = 'Location is too long';
                } else if (value && !/^[a-zA-Z0-9\s,.-]+$/.test(value)) {
                    error = 'Please use English characters for location';
                }
                break;
            default:
                break;
        }
        return error;
    };


    const handleInputChange = (e) => {
        let name, value;
        
        if (typeof e === 'string' && arguments.length === 2) {
            name = e;
            value = arguments[1];
        } else {
            ({ name, value } = e.target);
        }
        
        const error = validateInput(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));

        if (!error) {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };
    

    useEffect(() => {
        const checkPetExists = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/check-pet-exists/`, {
                    method: "GET",
                    credentials: "include",
                });
    
                if (!response.ok) throw new Error("Failed to check pet existence");
    
                const data = await response.json();
    
                if (data.has_pet) {
                    // 用户已注册宠物，跳转到 Matching 页面
                    navigate("/Matching");
                } else {
                    // 用户未注册宠物，允许页面渲染
                    setShouldRender(true);
                }
            } catch (error) {
                console.error("Error checking pet existence:", error);
                navigate("/login"); // 跳转到登录页面
            } finally {
                setIsLoading(false); // 结束加载状态
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

    // 上传照片事件处理函数
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
            health_states: formData.health_states, // 确保是数组
            characters: selectedCharacters.map(c => c.name),
            red_flags: selectedFlags.map(f => f.name),
            photos: photos.filter(p => p !== null),
        };
    
        console.log("Final Payload:", payload);
    
        try {
            const csrfToken = getCSRFToken();
            const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/ProfileSignUp/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify(payload),
            });
    
            if (response.ok) {
                alert("Pet profile created successfully!");
                window.location.href = '/Matching';
            } else {
                const data = await response.json();
                alert(data.error || "Failed to create profile.");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("Error submitting profile. Please try again.");
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
        <div className="profile-signup">
            <header className="AppHeader">
                <button className="header-button" onClick={() => window.location.href = "/"}>Home</button>
            </header>
            
            <div className="profile-title-container">
                <h1 className="profile-title">Profile Sign Up</h1>
                <div className="profile-paw-print">
                    <div className="profile-paw-image">
                        <img src={`${process.env.PUBLIC_URL}/image/g3023.svg`} alt="Paw Print" />
                    </div>
                </div>
            </div>
            
            {currentPage === 1 && (
                <div className="form-container">
                    <form className="form-grid">
                        <label>
                            Pet Name:
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="input-field"
                                maxLength={30} // 添加最大长度限制
                            />
                            {errors.name && <span className="error-message">{errors.name}</span>}
                        </label>
                        <label>
                            Birth Date:
                            <input
                                type="date"
                                name="birth_date"
                                value={formData.birth_date}
                                onChange={handleInputChange}
                                className="input-field"
                                max="2024-12-31" // 添加最大日期限制
                            />
                            {errors.birth_date && <span className="error-message">{errors.birth_date}</span>}
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
                                onChange={(e) => {
                                    const value = e.target.value;
                                    handleInputChange({
                                        target: {
                                            name: 'location',
                                            value
                                        }
                                    });
                                }}
                                className="input-field"
                                placeholder="Enter location"
                                ref={locationInputRef}
                                autoComplete="off"
                            />
                            {errors.location && <span className="error-message">{errors.location}</span>}
                        </label>
                        <label>
                            Sex:
                            <Select
                                className="basic-select"
                                classNamePrefix="select"
                                value={sexOptions.find(option => option.value === formData.sex)}
                                onChange={(option) => handleInputChange('sex', option.value)}
                                options={sexOptions}
                                placeholder="Select sex"
                            />
                        </label>
                        <label>
                            Preferred Time:
                            <Select
                                className="basic-select"
                                classNamePrefix="select"
                                value={timeOptions.find(option => option.value === formData.preferred_time)}
                                onChange={(option) => handleInputChange('preferred_time', option.value)}
                                options={timeOptions}
                                placeholder="Select time"
                            />
                        </label>
                        <label>
                            Weight (LBS):
                            <input
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleInputChange}
                                className="input-field"
                                min="0"
                                max="200" // 添加最大重量限制
                            />
                            {errors.weight && <span className="error-message">{errors.weight}</span>}
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
                    <h2 className="title">Adding photos for [Pet's name]!</h2>
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
                        <button className="button" onClick={handlePrevious}>
                            Previous
                        </button>
                        <button className="button" onClick={handleNext}>
                            Next
                        </button>
                    </div>
                </div>
            )}
       {/* Page3: Characters */}
            {currentPage === 3 && (
                <div className="characters-page">
                    <h2 className="page-title">Select Your Pet's Character</h2>
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
                        <button className="button" onClick={handlePrevious}>
                            Previous
                        </button>
                        <button className="button" onClick={handleNext}>
                            Next
                        </button>
                    </div>
                </div>
            )}
        {/* Page4: Red Flags */}
            {currentPage === 4 && (
                <div className="redflags-page">
                    <h1 className="page-title">Red Flags</h1>
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
                        <button className="button" onClick={handlePrevious}>
                            Previous
                        </button>
                        <button className="button" onClick={handleSubmit}>
                            Submit
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileSignUp;
import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import "../styles/ProfileSignUp.css";
import "../styles/AddPhoto.css";
import protectRedirect from "./protectRedirect";
import getCSRFToken from "./getCSRFToken";
import "../styles/RedFlags.css"; 



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
    const [shouldRender, setShouldRender] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); 
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

    // 页面加载后检查是否需要重定向
    useEffect(() => {
        const path = "/ProfileSignUp";
        const isRedirectNeeded = protectRedirect(path, path);
        if (!isRedirectNeeded) {
            setShouldRender(true);
        }
    }, []);

    // 更新表单数据
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

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

    // 表单提交
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Log form data before submission
        console.log("Form Data before submission:", formData);
        console.log("Selected Characters:", selectedCharacters);
        console.log("Selected Flags:", selectedFlags);
        console.log("Photos:", photos);

        const payload = {
            ...formData,
            health_states: Array.isArray(formData.health_states) ? formData.health_states.join(',') : formData.health_states,
            characters: selectedCharacters.map(c => c.name),
            red_flags: selectedFlags.map(f => f.name),
            photos: photos.filter(p => p !== null)
        };

        // Log the final payload
        console.log("Final Payload:", payload);
        console.log("CSRF Token:", getCSRFToken());

        try {
            const csrfToken = getCSRFToken();
            console.log("Making fetch request to:", `${process.env.REACT_APP_BACKEND}/api/ProfileSignUp/`);
            
            const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/ProfileSignUp/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            console.log("Response status:", response.status);
            console.log("Response headers:", Object.fromEntries(response.headers));

            if (response.ok) {
                alert("Pet profile created successfully!");
                window.location.href = '/Matching';
            } else {
                const data = await response.json();
                console.error("Server error response:", data);
                alert(data.error || "Failed to create profile. Please check all required fields.");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("Error submitting profile. Please try again.");
        }
    };
    

    // 切换页面
    const handleNext = () => setCurrentPage((prevPage) => prevPage + 1);
    const handlePrevious = () => setCurrentPage((prevPage) => prevPage - 1);

    if (!shouldRender) return null;

    return (
        <div className="profile-signup">
            {currentPage === 1 && (
                <div className="form-container">
                    <h2 className="profile-title">Profile Sign Up</h2>
                    <form className="form-grid">
                        <label>
                            Pet Name:
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="input-field"
                                placeholder="Enter pet's name"
                            />
                        </label>
                        <label>
                            Birth Date:
                            <input
                                type="date"
                                name="birth_date"
                                value={formData.birth_date}
                                onChange={handleInputChange}
                                className="input-field"
                            />
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
                            />
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
                                className="input-field"
                                placeholder="Enter weight"
                            />
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
                        <button type="button" className="next-button" onClick={handleNext}>
                            Next
                        </button>
                    </form>
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
       {/* 页面3: Characters */}
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
        {/* 页面4: Red Flags */}
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

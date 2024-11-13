import React, { useState, useEffect } from "react";
import Select from "react-select";
import "../styles/ProfileSignUp.css";
import protectRedirect from "./protectRedirect";

const ProfileSignUp = () => {
    const [shouldRender, setShouldRender] = useState(false);
    useEffect(() => {
        const path = "ProfileSignUp";
        const isRedirectNeeded = protectRedirect(path, path);
        if (!isRedirectNeeded) {
            setShouldRender(true);
        }
    }, []);

    const [formData, setFormData] = useState({
        name: "",
        sex: "",
        preferred_time: "",
        breed: "",
        birth_date: "",
        location: "",
        weight: "",
        health_states: []
    });

    const healthOptions = [
        { value: "rabies", label: "Rabies" },
        { value: "dhlpp", label: "DHLPP" },
        { value: "bordetella", label: "Bordetella" },
        { value: "heartworm", label: "Heartworm Prevention" },
        { value: "lyme", label: "Lyme Disease" },
        { value: "leptospirosis", label: "Leptospirosis" },
        { value: "influenza", label: "Canine Influenza" }
    ];

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:8000/api/pets/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("Pet profile created successfully!");
                setFormData({
                    name: "",
                    sex: "",
                    preferred_time: "",
                    breed: "",
                    birth_date: "",
                    location: "",
                    weight: "",
                    health_states: []
                });
            } else {
                alert("Failed to create pet profile. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="profile-signup">
            <header className="AppHeader">
                <button className="header-button">Home</button>
                <button className="header-button">Login</button>
                <button className="header-button">Register</button>
            </header>

            <div className="form-container">
                <h2 className="profile-title">Profile Sign Up</h2>
                <form onSubmit={handleSubmit} className="form-grid">
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
                            options={healthOptions}
                            onChange={handleSelectChange}
                            classNamePrefix="select"
                            placeholder="Select health state"
                        />
                    </label>
                    <button type="submit" className="next-button">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileSignUp;

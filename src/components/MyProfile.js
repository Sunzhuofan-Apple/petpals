import React, { useEffect, useState } from "react";
import "../styles/MyProfile.css";

const MyProfile = () => {
    const [petData, setPetData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPetData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/user-pet/`, {
                    method: "GET",
                    credentials: "include", 
                });

                if (response.ok) {
                    const data = await response.json();
                    setPetData(data);
                } else {
                    const errorData = await response.json();
                    setError(errorData.error || "Failed to fetch pet data.");
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchPetData();
    }, []);

    if (error) {
        return <p className="error">Error: {error}</p>;
    }

    if (!petData) {
        return <p>Loading...</p>;
    }

    const {
        name,
        sex,
        breed,
        birth_date,
        location,
        weight,
        preferred_time,
        health_states,
        characters,
        red_flags,
        photos,
    } = petData;

    return (
        <div className="profile">
            <div className="photo-placeholder">
                {photos && photos.length > 0 && photos[0] ? (
                    
                    <img
                    src={photos[0]}  // 直接使用完整的 URL
                    alt={`${name}'s photo`}
                    className="profile-photo"
                />
                
                ) : (
                    <p>No photo available</p>
                )}
            </div>

            <div className="text-wrapper-6">My Profile</div>
            <div className="group">
                <p className="kiwi-sex-man-breed">
                    <span className="span">{name} <br /></span>
                    <span className="text-wrapper-5">
                        Sex: {sex} <br />
                        Breed: {breed} <br />
                        Dog-walking time slot: {preferred_time} <br />
                        Age: {new Date().getFullYear() - new Date(birth_date).getFullYear()} years old <br />
                        Weight: {weight} lbs <br />
                        Location: {location} <br />
                        Health states: {health_states} <br />
                        Character: {characters} <br />
                        Red flags: {red_flags} <br />
                    </span>
                </p>
            </div>
        </div>
    );
};

export default MyProfile;


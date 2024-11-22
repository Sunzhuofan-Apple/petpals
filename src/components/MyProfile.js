import React from "react";
import "../styles/MyProfile.css";

export const MyProfile = ({ birthDate, followers = 0, following = 0 }) => {
    const calculateAge = (birthDate) => {
        const birthYear = new Date(birthDate).getFullYear();
        const currentYear = 2024;
        return currentYear - birthYear;
    };

    const age = calculateAge(birthDate);

    return (
        <div className="profile">
            <div className="photo-placeholder" />
            <div className="text-wrapper-6">My Profile</div>
            <div className="group">
                <p className="kiwi-sex-man-breed">
                    <span className="span">Kiwi<br /></span>
                    <span className="text-wrapper-5">
                        Sex: Man<br />
                        Breed: Yorkshire Terrier<br />
                        Dog-walking time slot:<br />
                        Age: {age} years old<br />
                        Weight: 8 lbs<br />
                        Character:<br />
                        Redflag:
                    </span>
                </p>
            </div>
            <div className="shots-followers">
                <div className="edit-profile">Edit Profile</div>
                <div className="divider" />
                <div className="text-wrapper-3">{followers}<br /><span>Followers</span></div>
                <div className="divider" />
                <div className="text-wrapper-4">{following}<br /><span>Following</span></div>
            </div>
        </div>
    );
};

export default MyProfile;
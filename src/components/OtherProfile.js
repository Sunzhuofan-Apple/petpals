import React from "react";
import "../styles/OtherProfile.css";

export const OtherProfile = ({ name, petName, followers = 0, following = 0, distance }) => {
    return (
        <div className="profile-container">
            <div className="photo-placeholder" />
            <div className="profile-title">{name}'s Profile</div>
            <div className="profile-details">
                <p className="pet-info">
                    <span className="pet-name">{petName}<br /></span>
                    <span className="pet-details">
                        Sex: Man<br />
                        Breed: Yorkshire Terrier<br />
                        Dog-walking time slot:<br />
                        Age: 7 years old<br />
                        Weight: 8 lbs<br />
                        Character:<br />
                        Redflag:<br />
                        {distance} miles away from you
                    </span>
                </p>
            </div>
            <div className="social-stats">
                <div className="followers">{followers}<br /><span>Followers</span></div>
                <div className="divider" />
                <div className="following">{following}<br /><span>Following</span></div>
            </div>
        </div>
    );
};

export default OtherProfile;
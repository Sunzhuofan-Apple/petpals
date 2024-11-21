import React from "react";
import "../styles/MyProfile.css";

export const MyProfile = () => {
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
                        Age: 7 years old<br />
                        Weight: 8 lbs<br />
                        Character:<br />
                        Redflag:
                    </span>
                </p>
            </div>
            <div className="shots-followers">
                <div className="edit-profile">Edit Profile</div>
                <div className="divider" />
                <div className="text-wrapper-3">238<br /><span>Followers</span></div>
                <div className="divider" />
                <div className="text-wrapper-4">101<br /><span>Following</span></div>
            </div>
        </div>
    );
};

export default MyProfile;
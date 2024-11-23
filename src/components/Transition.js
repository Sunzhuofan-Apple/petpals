import React from "react";
import "../styles/Transition.css";
import illustrationImage from "../assets/illustration-image.png";

const Transition = ({ onFinish }) => {
    return (
        <div className="transition-container">
            <div className="content-wrapper">
                <div className="main-content">
                    <div className="text-section">
                        <h1 className="title">
                            <span className="highlight">Congrats!</span>
                            You have finished
                            the sign up!
                        </h1>
                    </div>
                    <div className="image-section">
                        <img 
                            src={illustrationImage} 
                            alt="Celebration illustration" 
                            className="illustration"
                        />
                    </div>
                </div>
                <button className="match-button" onClick={onFinish}>
                    Match with friends!
                </button>
            </div>
        </div>
    );
};

export default Transition;
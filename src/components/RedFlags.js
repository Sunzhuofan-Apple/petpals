import React, { useState } from "react";
import "../styles/RedFlags.css";

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

export const RedFlags = () => {
    const [selectedFlags, setSelectedFlags] = useState([]);

    const handleFlagSelect = (flag) => {
        if (selectedFlags.includes(flag)) {
            setSelectedFlags(prev => prev.filter(f => f !== flag));
        } else if (selectedFlags.length < 3) {
            setSelectedFlags(prev => [...prev, flag]);
        }
    };

    const handleSubmit = () => {
        console.log("Selected red flags:", selectedFlags);
    };

    return (
        <div className="redflags-container">
            <div className="content-wrapper">
                <h1 className="page-title">Red Flags</h1>
                <div className="flag-grid">
                    {redFlagsList.map((flag) => (
                        <button 
                            key={flag.id}
                            className={`flag-card ${
                                selectedFlags.includes(flag) ? 'selected' : ''
                            } ${
                                selectedFlags.length >= 3 && 
                                !selectedFlags.includes(flag) ? 'disabled' : ''
                            }`}
                            onClick={() => handleFlagSelect(flag)}
                        >
                            <span className="flag-name">{flag.name}</span>
                        </button>
                    ))}
                </div>
                <p className="selection-counter">
                    {selectedFlags.length}/3
                </p>
                <button 
                    className="next-button"
                    onClick={handleSubmit}
                    disabled={selectedFlags.length === 0}
                >
                    <span className="button-text">Next</span>
                </button>
            </div>
        </div>
    );
};

export default RedFlags;

import React, { useState } from "react";
import "../styles/Matching.css";

const profiles = [
    { name: "Kiwi", breed: "Yorkshire Terrier", age: 7, weight: 8, distance: 5 },
    { name: "Cake", breed: "Welsh Corgi", age: 2, weight: 10, distance: 36.8 },
    { name: "Buddy", breed: "Golden Retriever", age: 3, weight: 70, distance: 10 },
    { name: "Max", breed: "Labrador", age: 4, weight: 65, distance: 12 },
    { name: "Bella", breed: "Poodle", age: 5, weight: 50, distance: 8 },
    { name: "Charlie", breed: "Beagle", age: 6, weight: 25, distance: 15 },
    { name: "Lucy", breed: "Bulldog", age: 3, weight: 40, distance: 20 },
    { name: "Daisy", breed: "Boxer", age: 4, weight: 60, distance: 18 }
];

export const Matching = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const showPreviousProfile = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + profiles.length) % profiles.length);
    };

    const showNextProfile = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % profiles.length);
    };

    const getProfile = (index) => {
        return profiles[(currentIndex + index) % profiles.length];
    };

    return (
        <div className="matching-container">
            <div className="controls">
                <button className="sort-button">Sort by destination</button>
                <button className="filter-button">Filter</button>
            </div>

            <div className="profile-card small">
                <div className="profile-image" />
                <div className="profile-name">{getProfile(0).name}</div>
                <p className="profile-details">
                    {getProfile(0).breed}, {getProfile(0).age} years old, {getProfile(0).weight} lbs
                    <br />
                    {getProfile(0).distance} miles away from you
                </p>
                <button className="wag-button">Wag your tail</button>
            </div>

            <div className="profile-card large">
                <div className="profile-image" />
                <div className="profile-name">{getProfile(1).name}</div>
                <p className="profile-details">
                    {getProfile(1).breed}, {getProfile(1).age} years old, {getProfile(1).weight} lbs
                    <br />
                    {getProfile(1).distance} miles away from you
                </p>
                <button className="wag-button">Wag your tail</button>
            </div>

            <div className="profile-card small">
                <div className="profile-image" />
                <div className="profile-name">{getProfile(2).name}</div>
                <p className="profile-details">
                    {getProfile(2).breed}, {getProfile(2).age} years old, {getProfile(2).weight} lbs
                    <br />
                    {getProfile(2).distance} miles away from you
                </p>
                <button className="wag-button">Wag your tail</button>
            </div>

            <button className="arrow left-arrow" onClick={showPreviousProfile}>{"<"}</button>
            <button className="arrow right-arrow" onClick={showNextProfile}>{">"}</button>
        </div>
    );
};

export default Matching;
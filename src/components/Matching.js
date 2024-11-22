import React, { useState, useEffect } from "react";
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
    const [currentUser, setCurrentUser] = useState(null);
    const [userPet, setUserPet] = useState(null);
    const [profiles, setProfiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // useEffect(() => {
    //     fetch(`${process.env.REACT_APP_BACKEND}/auth/redirect/`, {
    //         method: 'GET',
    //         credentials: 'include',
    //     })
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error('未登录');
    //         }
    //         return response.json();
    //     })
    //     .then(data => {
    //         if (data.is_authenticated) {
    //             setCurrentUser(data.user);
    //             return fetch(`${process.env.REACT_APP_BACKEND}/api/match-pet/`, {
    //                 method: 'GET',
    //                 credentials: 'include',
    //             });
    //         } else {
    //             throw new Error('未登录');
    //         }
    //     })
    //     .then(response => {
    //         if (!response || !response.ok) {
    //             throw new Error('Failed to fetch pet data');
    //         }
    //         return response.json();
    //     })
    //     .then(petData => {
    //         if (petData) {
    //             setUserPet(petData);
    //             return fetch(`${process.env.REACT_APP_BACKEND}/api/sorted-profiles/`, {
    //                 method: 'GET',
    //                 credentials: 'include',
    //             });
    //         }
    //         throw new Error('No pet data found');
    //     })
    //     .then(response => {
    //         if (!response || !response.ok) {
    //             throw new Error('Failed to fetch sorted profiles');
    //         }
    //         return response.json();
    //     })
    //     .then(sortedProfiles => {
    //         if (sortedProfiles) {
    //             setProfiles(sortedProfiles);
    //         }
    //         setIsLoading(false);
    //     })
    //     .catch(error => {
    //         console.error('Error:', error);
    //         setIsLoading(false);
    //         if (error.message === '未登录') {
    //             window.location.href = '/Register?next=/Matching';
    //         }
    //     });
    // }, []);

    // Add sort by distance function
    const handleSortByDistance = () => {
        const sortedProfiles = [...profiles].sort((a, b) => a.distance - b.distance);
        setProfiles(sortedProfiles);
        setCurrentIndex(0);
    };

    // 添加按match排序的函数
    const handleSortByMatch = () => {
        const sortedProfiles = [...profiles].sort((a, b) => {
            const scoreA = calculateMatchScore(userPet, a);
            const scoreB = calculateMatchScore(userPet, b);
            return scoreB - scoreA; // 降序排列，匹配度高的在前
        });
        setProfiles(sortedProfiles);
        setCurrentIndex(0);
    };

    const showPreviousProfile = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + profiles.length) % profiles.length);
    };

    const showNextProfile = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % profiles.length);
    };

    const getProfile = (index) => {
        if (!profiles.length) return null;
        const profile = profiles[(currentIndex + index) % profiles.length];
        return {
            ...profile,
            matchScore: calculateMatchScore(userPet, profile)
        };
    };

    const calculateMatchScore = (userPet, profile) => {
        let score = 0;
        
        if (userPet.preferred_time === profile.preferred_time) {
            score += 30;
        }
        
        const distanceScore = Math.max(0, 40 - (profile.distance * 2)); // 距离越近分数越高
        score += distanceScore;
        
        const userHealthStates = userPet.health_states.split(',');
        const profileHealthStates = profile.health_states.split(',');
        const commonHealth = userHealthStates.filter(health => 
            profileHealthStates.includes(health)
        ).length;
        score += commonHealth * 10;
        
        return Math.min(100, score);
    };

    // 修改卡片位置控制函数
    const getCardPosition = (index) => {
        const diff = (index - currentIndex + profiles.length) % profiles.length;
        if (diff === 0) return 'center';
        if (diff === 1) return 'right';
        if (diff === profiles.length - 1) return 'left';
        return 'hidden';
    };

    return (
        <div className="matching-container">
            {
            // isLoading ? (
            //     <div>Loading...</div>
            // ) : !userPet ? (
            //     <div className="no-pet-message">
            //         <h2>Please set up your pet profile first</h2>
            //         <button onClick={() => window.location.href = '/ProfileSignUp'}>
            //             Set Up Profile
            //         </button>
            //     </div>
            // ) : profiles.length === 0 ? (
            //     <div className="no-matches-message">
            //         <h2>No matches found</h2>
            //         <p>Check back later for new potential matches!</p>
            //     </div>
            // ) : 
            (
                <>
                    <div className="controls">
                        <button className="sort-button" onClick={handleSortByDistance}>
                            Sort by distance
                        </button>
                        <button className="sort-button" onClick={handleSortByMatch}>
                            Sort by match
                        </button>
                    </div>

                    <div className="cards-container">
                        {profiles.map((profile, index) => {
                            const position = getCardPosition(index);
                            if (position === 'hidden') return null;

                            return (
                                <div 
                                    key={profile.id || index}
                                    className={`profile-card ${position}`}
                                >
                                    <div className="match-score">
                                        Match: {calculateMatchScore(userPet, profile)}%
                                    </div>
                                    <div className="profile-name">{profile.name}</div>
                                    <p className="profile-details">
                                        {profile.breed}, {profile.age} years old, {profile.weight} lbs
                                        <br />
                                        {profile.distance} miles away from you
                                    </p>
                                    <button className="wag-button">Wag your tail</button>
                                </div>
                            );
                        })}
                    </div>

                    <button className="arrow left-arrow" onClick={showPreviousProfile}>{"<"}</button>
                    <button className="arrow right-arrow" onClick={showNextProfile}>{">"}</button>
                </>
            )}
        </div>
    );
};

export default Matching;
import React, { useState, useEffect } from "react";
import "../styles/Matching.css";

export const Matching = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);
    const [userPet, setUserPet] = useState(null);
    const [profiles, setProfiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const authResponse = await fetch(`${process.env.REACT_APP_BACKEND}/auth/redirect/`, {
                    method: 'GET',
                    credentials: 'include',
                });
                
                if (!authResponse.ok) throw new Error('Not logged in');
                const authData = await authResponse.json();
                if (!authData.is_authenticated) throw new Error('Not logged in');
                
                setCurrentUser(authData.user);

                const petResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/match-pet/`, {
                    method: 'GET',
                    credentials: 'include',
                });
                
                if (!petResponse.ok) throw new Error('Failed to fetch pet data');
                const petData = await petResponse.json();
                if (!petData) throw new Error('No pet data found');
                
                setUserPet(petData);

                const profilesResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/sorted-profiles/`, {
                    method: 'GET',
                    credentials: 'include',
                });
                
                if (!profilesResponse.ok) throw new Error('Failed to fetch sorted profiles');
                const sortedProfiles = await profilesResponse.json();
                
                // Fetch following status for each profile
                const followingResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/following/`, {
                    method: 'GET',
                    credentials: 'include',
                });
                
                if (!followingResponse.ok) throw new Error('Failed to fetch following status');
                const followingData = await followingResponse.json();
                const followingIds = followingData.following.map(pet => pet.id);
                
                // Add isFollowing property to each profile
                const profilesWithFollowing = sortedProfiles.map(profile => ({
                    ...profile,
                    isFollowing: followingIds.includes(profile.id)
                }));
                
                if (profilesWithFollowing) setProfiles(profilesWithFollowing);
                
            } catch (error) {
                console.error('Error:', error);
                if (error.message === 'Not logged in') {
                    window.location.href = '/Register?next=/Matching';
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Add sort by distance function
    const handleSortByDistance = () => {
        const sortedProfiles = [...profiles].sort((a, b) => a.distance - b.distance);
        setProfiles(sortedProfiles);
        setCurrentIndex(0);
    };

    const handleSortByMatch = () => {
        const sortedProfiles = [...profiles].sort((a, b) => {
            const scoreA = calculateMatchScore(userPet, a);
            const scoreB = calculateMatchScore(userPet, b);
            return scoreB - scoreA; 
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
    
        // Check preferred time match
        if (userPet.preferred_time === profile.preferred_time) {
            score += 30;
        }
    
        // Calculate distance score
        const distanceScore = Math.max(0, 40 - (profile.distance * 2)); // Score decreases with distance
        score += distanceScore;
    
        // Ensure health_states are arrays
        const userHealthStates = Array.isArray(userPet.health_states) 
            ? userPet.health_states 
            : userPet.health_states.split(',');
    
        const profileHealthStates = Array.isArray(profile.health_states) 
            ? profile.health_states 
            : profile.health_states.split(',');
    
        // Calculate common health states score
        const commonHealth = userHealthStates.filter(health =>
            profileHealthStates.includes(health)
        ).length;
        score += commonHealth * 10; // Each common health state adds 10 points
    
        return Math.min(100, score); // Cap score at 100
    };
    

    const getCardPosition = (index) => {
        const diff = (index - currentIndex + profiles.length) % profiles.length;
        if (diff === 0) return 'center';
        if (diff === 1) return 'right';
        if (diff === profiles.length - 1) return 'left';
        return 'hidden';
    };

    const handleWagClick = async (profileId) => {
        if (!profileId) {
            console.error('Profile ID is undefined');
            return;
        }

        try {
            const csrfToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('csrftoken='))
                ?.split('=')[1];

            const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/follow-pet/${profileId}/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to follow pet: ${response.status} ${errorText}`);
            }

            const data = await response.json();
            
            const updatedProfiles = profiles.map(profile => {
                if (profile.id === profileId) {
                    return { ...profile, isFollowing: true };
                }
                return profile;
            });
            setProfiles(updatedProfiles);
            console.log('Successfully followed pet', profileId, 'following', updatedProfiles);
        } catch (error) {
            console.error('Error following pet:', error);
            alert(`Unable to follow pet: ${error.message}. Please try again or contact support if the issue persists.`);
        }
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

                                const { photos = [], name, breed, age, weight, distance } = profile; 

                                return (
                                    <div 
                                        key={index}
                                        className={`profile-card ${position}`}
                                    >
                                        <div className="match-score">
                                            Match: {calculateMatchScore(userPet, profile)}%
                                        </div>
                                        <img
                                            src={photos.length > 0 ? photos[0] : 'default-avatar.png'} 
                                            alt={`${name}'s photo`}
                                            className="profile-photo"
                                        />
                                        <div className="profile-name">{name}</div>
                                        <p className="profile-details">
                                            {breed}, {age} years old, {weight} lbs
                                            <br />
                                            {distance} miles away from you
                                        </p>
                                        <button 
                                            className="wag-button"
                                            onClick={() => handleWagClick(profile.id)}
                                        >
                                            {profile.isFollowing ? 'Wagging!' : 'Wag your tail'}
                                        </button>
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
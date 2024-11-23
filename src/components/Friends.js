import React, { useState, useEffect } from "react";
import "../styles/Friends.css";

const Friends = () => {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch followers
        const followersResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/followers/`, {
          credentials: 'include'
        });
        
        if (!followersResponse.ok) throw new Error('Failed to fetch followers');
        const followersData = await followersResponse.json();
        setFollowers(followersData.followers);

        // Fetch following
        const followingResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/following/`, {
          credentials: 'include'
        });
        
        if (!followingResponse.ok) throw new Error('Failed to fetch following');
        const followingData = await followingResponse.json();
        setFollowing(followingData.following);

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleWagBack = async (followerId) => {
    try {
      console.log('Attempting to wag back to pet ID:', followerId);
      
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
      
      const follower = followers.find(f => f.id === followerId);
      const isWagging = follower?.hasWaggedBack;
      const endpoint = isWagging ? 'unfollow-pet' : 'wag-back';
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/${endpoint}/${followerId}/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
        }
      });

      console.log('Wag back response status:', response.status);
      const responseData = await response.json();
      console.log('Wag back response data:', responseData);

      if (!response.ok) throw new Error(`Failed to ${isWagging ? 'unfollow' : 'wag back'}`);

      // Update followers list to show wag back status
      setFollowers(followers.map(follower => 
        follower.id === followerId 
          ? { ...follower, hasWaggedBack: !isWagging }
          : follower
      ));

      // Fetch updated following list
      const followingResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/following/`, {
        credentials: 'include'
      });
      
      if (!followingResponse.ok) throw new Error('Failed to fetch following');
      const followingData = await followingResponse.json();
      setFollowing(followingData.following);

    } catch (err) {
      console.error('Error wagging back:', err);
    }
  };

  const handleUnfollow = async (followId) => {
    try {
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/unfollow-pet/${followId}/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
        }
      });

      if (!response.ok) throw new Error('Failed to unfollow');
      
      // Remove from following list
      setFollowing(following.filter(follow => follow.id !== followId));
      
    } catch (err) {
      console.error('Error unfollowing:', err);
    }
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="friends-container">
      <h1 className="main-title">Friends</h1>
      <div className="friends-content">
        {/* Left Column - Followers */}
        <div className="friends-column">
          <h2 className="column-title">
            <span className="count">{followers.length}</span> Followers
          </h2>
          <div className="friends-list">
            {followers.map((follower) => (
              <div className="friend-item" key={follower.id}>
                <div className="friend-avatar"></div>
                <div className="friend-content">
                  <div className="friend-text">
                    {`${follower.name} wags your tail and says hi`}
                  </div>
                  <button
                    className={`wag-back-button ${follower.hasWaggedBack ? 'wagging' : ''}`}
                    onClick={() => handleWagBack(follower.id)}
                  >
                    {follower.hasWaggedBack ? 'Wagging' : 'Wag back'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Following */}
        <div className="friends-column">
          <h2 className="column-title">
            <span className="count">{following.length}</span> Following
          </h2>
          <div className="friends-list">
            {following.map((follow) => (
              <div className="friend-item" key={follow.id}>
                <div className="friend-avatar"></div>
                <div className="friend-content">
                  <div className="friend-text">
                    {`You wag ${follow.name}'s tail and say hi`}
                  </div>
                  <button
                    className="wag-back-button wagging"
                    onClick={() => handleUnfollow(follow.id)}
                  >
                    Unfollow
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friends;

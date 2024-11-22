import React, { useState, useEffect } from "react";
import "../styles/Friends.css";

const Friends = () => {
  // fakedata
  const fakeFollowers = [
    { id: 1, name: "KK" },
    { id: 2, name: "Owl" },
    { id: 3, name: "Cici" },
    { id: 4, name: "Kiwi" }
  ];

  const fakeFollowing = [
    { id: 1, name: "Cake" },
    { id: 2, name: "Pomba" },
    { id: 3, name: "Dori" },
    { id: 4, name: "Dry" }
  ];

  const [followers, setFollowers] = useState(fakeFollowers);
  const [following, setFollowing] = useState(fakeFollowing);

  const handleWagBack = (followerId) => {
    // 这里添加回应的逻辑
    console.log(`Wagged back to ${followerId}`);
  };

  return (
    <div className="friends-container">
      <h1 className="main-title">Friends</h1>
      <div className="friends-content">
        {/* Left Column */}
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
                    className="wag-back-button"
                    onClick={() => handleWagBack(follower.id)}
                  >
                    Wag back
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="friends-column">
          <h2 className="column-title">
            <span className="count">{following.length}</span> Following
          </h2>
          <div className="friends-list">
            {following.map((follow) => (
              <div className="friend-item" key={follow.id}>
                <div className="friend-avatar"></div>
                <div className="friend-text">{`You wags ${follow.name}'s tail and says hi`}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friends;

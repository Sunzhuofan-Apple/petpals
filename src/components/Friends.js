import React, { useState, useEffect } from "react";
import "../styles/Friends.css";
import getCSRFToken from "./getCSRFToken";
import { useNavigate } from "react-router-dom";

const Friends = () => {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    // Fetch login state and username
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND}/auth/redirect/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.is_authenticated) {
            setIsLogin(true);
            setUsername(data.username);
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();

    // Fetch followers and following
    const fetchData = async () => {
      try {
        const followersResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/followers/`, {
          credentials: "include",
        });
        if (!followersResponse.ok) throw new Error("Failed to fetch followers");
        const followersData = await followersResponse.json();
        setFollowers(followersData.followers);

        const followingResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/following/`, {
          credentials: "include",
        });
        if (!followingResponse.ok) throw new Error("Failed to fetch following");
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

  const handleLogout = () => {
    fetch(`${process.env.REACT_APP_BACKEND}/api/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCSRFToken(),
      },
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          setIsLogin(false);
          setUsername("");
        }
      })
      .catch((err) => console.error("Logout error:", err));
  };

  const handleMouseEnter = () => setShowMenu(true);
  const handleMouseLeave = () => setShowMenu(false);
  const navigate = useNavigate();

  const navigateTo = (path) => {
    console.log("path", path);
    if (path === "Homepage") {
      navigate(`/`);
    } else {
      navigate(`${path}`);
    }
    setShowMenu(false);
  };

  const handleWagBack = async (followerId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/wag-back/${followerId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFToken(),
        },
        credentials: "include",
        body: JSON.stringify({ followerId }),
      });
      if (response.ok) {
        const updatedFollower = await response.json();
        setFollowers((prevFollowers) =>
          prevFollowers.map((follower) =>
            follower.id === updatedFollower.id ? updatedFollower : follower
          )
        );
      }
    } catch (err) {
      console.error("Error wagging back:", err);
    }
  };
  
  const handleUnfollow = async (followingId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/unfollow-pet/${followingId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFToken(),
        },
        credentials: "include",
        body: JSON.stringify({ followingId }),
      });
      if (response.ok) {
        setFollowing((prevFollowing) =>
          prevFollowing.filter((follow) => follow.id !== followingId)
        );
      }
    } catch (err) {
      console.error("Error unfollowing:", err);
    }
  };
  
  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="friends-container">
      {/* Header */}
      <header className="AppHeader">
        <div
          className="header-button username"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {username}
          {showMenu && (
            <div className="dropdown-menu">
              <button onClick={() => navigateTo("Homepage")}>Homepage</button>
              <button onClick={() => navigateTo("/MyProfile")}>Profile</button>
            </div>
          )}
        </div>
        <button className="header-button" onClick={handleLogout}>
          {isLogin ? "Logout" : "Login"}
        </button>
      </header>

      {/* Friends Content */}
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
                    className={`wag-back-button ${follower.hasWaggedBack ? "wagging" : ""}`}
                    onClick={() => handleWagBack(follower.id)}
                  >
                    {follower.hasWaggedBack ? "Wagging" : "Wag back"}
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
                    {`You wag `}
                    <span 
                      className="friend-name"
                      onClick={() => window.location.href = `/OtherProfile/${follow.id}`}
                    >
                      {follow.name}
                    </span>
                    {`'s tail and say hi`}
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

import React, { useEffect, useState } from "react";
import "../styles/MyProfile.css";
import getCSRFToken from "./getCSRFToken";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const [petData, setPetData] = useState(null);
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

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

    // Fetch pet data
    const fetchPetData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/user-pet/`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setPetData(data);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to fetch pet data.");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPetData();

    // Add new fetch for followers and following
    const fetchFriendsData = async () => {
      try {
        const followersResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/followers/`, {
          credentials: "include",
        });
        if (followersResponse.ok) {
          const followersData = await followersResponse.json();
          setFollowers(followersData.followers);
        }

        const followingResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/following/`, {
          credentials: "include",
        });
        if (followingResponse.ok) {
          const followingData = await followingResponse.json();
          setFollowing(followingData.following);
        }
      } catch (err) {
        console.error("Error fetching friends data:", err);
      }
    };

    fetchFriendsData();
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

  if (error) {
    return <p className="error">Error: {error}</p>;
  }

  if (!petData) {
    return <p>Loading...</p>;
  }

  const {
    name,
    sex,
    breed,
    birth_date,
    location,
    weight,
    preferred_time,
    health_states,
    characters,
    red_flags,
    photos,
  } = petData;

  return (
    <div className="profile">
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
              <button onClick={() => navigateTo("/Friends")}>Friends</button>
              <button onClick={() => navigateTo("/Matching")}>Matching</button>
            </div>
          )}
        </div>
        <button className="header-button" onClick={handleLogout}>
          {isLogin ? "Logout" : "Login"}
        </button>
      </header>

      <div className="text-wrapper-6">My Profile</div>
      
      <div className="photo-placeholder">
        {photos && photos.length > 0 && photos[0] ? (
          <img
            src={photos[0]}
            alt={`${name}'s photo`}
            className="profile-photo"
          />
        ) : (
          <p>No photo available</p>
        )}
      </div>

      <div className="group">
        <p className="kiwi-sex-man-breed">
          <span className="span">{name}</span>
          <div className="info-grid">
            <div className="info-item">
              <span className="label-text">Sex:</span>
              <span className="info-value">{sex}</span>
            </div>
            <div className="info-item">
              <span className="label-text">Breed:</span>
              <span className="info-value">{breed}</span>
            </div>
            <div className="info-item">
              <span className="label-text">Dog-walking time:</span>
              <span className="info-value">{preferred_time}</span>
            </div>
            <div className="info-item">
              <span className="label-text">Age:</span>
              <span className="info-value">{new Date().getFullYear() - new Date(birth_date).getFullYear()} years old</span>
            </div>
            <div className="info-item">
              <span className="label-text">Weight:</span>
              <span className="info-value">{weight} lbs</span>
            </div>
            <div className="info-item">
              <span className="label-text">Location:</span>
              <span className="info-value">{location}</span>
            </div>
            <div className="info-item">
              <span className="label-text">Health states:</span>
              <span className="info-value">{health_states}</span>
            </div>
            <div className="info-item">
              <span className="label-text">Character:</span>
              <span className="info-value">
                {Array.isArray(characters) 
                  ? characters.join(', ')
                  : typeof characters === 'string' 
                    ? characters.split(',').join(', ') 
                    : characters}
              </span>
            </div>
            <div className="info-item">
              <span className="label-text">Red flags:</span>
              <span className="info-value">
                {Array.isArray(red_flags)
                  ? red_flags.join(', ')
                  : typeof red_flags === 'string'
                    ? red_flags.split(',').join(', ')
                    : red_flags}
              </span>
            </div>
          </div>
        </p>
      </div>
      <div className="shots-followers">
        <button 
          className="edit-profile" 
          onClick={() => window.location.href = '/ProfileSignUp?from=MyProfile'}
        >
          Edit Profile
        </button>
        <div className="divider"></div>
        <div className="followers-section" onClick={() => window.location.href = '/Friends'}>
          <div className="count">{followers.length}</div>
          <div className="label">Followers</div>
        </div>
        <div className="divider"></div>
        <div className="following-section" onClick={() => window.location.href = '/Friends'}>
          <div className="count">{following.length}</div>
          <div className="label">Following</div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;


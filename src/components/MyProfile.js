import React, { useEffect, useState } from "react";
import "../styles/MyProfile.css";
import getCSRFToken from "./getCSRFToken";

const MyProfile = () => {
  const [petData, setPetData] = useState(null);
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

  const navigateTo = (path) => {
    if (path === "Homepage") {
      window.location.href = "http://localhost:3000/"; 
    } else {
      window.location.href = path;
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
      {/* Header Section */}
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
            </div>
          )}
        </div>
        <button className="header-button" onClick={handleLogout}>
          {isLogin ? "Logout" : "Login"}
        </button>
      </header>

      {/* Profile Content */}
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

      <div className="text-wrapper-6">My Profile</div>
      <div className="group">
        <p className="kiwi-sex-man-breed">
          <span className="span">{name} <br /></span>
          <span className="text-wrapper-5">
            Sex: {sex} <br />
            Breed: {breed} <br />
            Dog-walking time slot: {preferred_time} <br />
            Age: {new Date().getFullYear() - new Date(birth_date).getFullYear()} years old <br />
            Weight: {weight} lbs <br />
            Location: {location} <br />
            Health states: {health_states} <br />
            Character: {characters} <br />
            Red flags: {red_flags} <br />
          </span>
        </p>
      </div>
    </div>
  );
};

export default MyProfile;


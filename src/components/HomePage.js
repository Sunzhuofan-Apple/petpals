import React, { useState, useEffect } from 'react';
import '../styles/HomePage.css';
import protectRedirect from './protectRedirect';
import getCSRFToken from './getCSRFToken';

function HomePage() {
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND}/auth/redirect/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json(); // Parse the JSON response
          console.log("Fetched data:", data);
          if (data && data.is_authenticated) {
            setIsLogin(true);
            setUsername(data.username);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleMouseEnter = () => {
    setShowMenu(true);
  };

  const handleMouseLeave = () => {
    setShowMenu(false);
  };

  const navigateTo = (path) => {
    window.location.href = path; 
    setShowMenu(false);
  };

  const handleGetStarted = () => {
    protectRedirect("", "/ProfileSignUp");
  };

  const handleLogin = () => {
    if (!isLogin) {
      window.location.href = "/Register";
    } else {
      fetch(`${process.env.REACT_APP_BACKEND}/api/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRFToken(),
        },
        credentials: 'include',
      })
        .then((response) => {
          if (response.ok) {
            setIsLogin(false);
            setUsername("");
          }
        });
    }
  };

  return (
    <div className="HomePage">
      <header className="AppHeader">
        <div
          className="header-button username"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {username}
          {showMenu && (
            <div className="dropdown-menu">
              <button onClick={() => navigateTo('/MyProfile')}>Profile</button>
              <button onClick={() => navigateTo('/Friends')}>Friends</button>
            </div>
          )}
        </div>
        <button className="header-button" onClick={handleLogin}>
          {isLogin ? "Logout" : "Login"}
        </button>
      </header>

      {/* 其余内容 */}
      <div className="home-header-section">
        <img className="HeaderImage" src={`${process.env.PUBLIC_URL}/image/header.jpg`} alt="Header" />
        <div className="home-intro-text">
          <div className="home-tagline">
            <span className="home-text-black">Connect. </span>
            <span className="home-text-highlight">Match</span>
            <span className="home-text-black">.Wag!</span>
          </div>
          <button className="GetStartedButton" onClick={handleGetStarted}>Get Started</button>
        </div>
      </div>

      <div className="home-promise-section">
        <div className="home-promise-text">Petpal Promise</div>
        <div className="home-paw-print">
          <div className="home-paw-image">
            <img src={`${process.env.PUBLIC_URL}/image/g3023.svg`} alt="Paw Print" />
          </div>
        </div>
      </div>

      <div className="FeaturesSection">
        <div className="FeatureCard">
          <img className="FeatureImage" src={`${process.env.PUBLIC_URL}/image/1.svg`} alt="Owner Profile" />
          <div className="FeatureTitle">SET YOUR PROFILE</div>
        </div>
        <div className="FeatureCard">
          <img className="FeatureImage" src={`${process.env.PUBLIC_URL}/image/2.svg`} alt="Pet Shop" />
          <div className="FeatureTitle">MATCH AND CHAT</div>
        </div>
        <div className="FeatureCard">
          <img className="FeatureImage" src={`${process.env.PUBLIC_URL}/image/3.svg`} alt="Pets Allowed" />
          <div className="FeatureTitle">FIND PLACE TO WALKING</div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;




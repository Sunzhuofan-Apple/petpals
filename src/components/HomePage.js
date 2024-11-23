import React, { useState, useEffect } from 'react';
import '../styles/HomePage.css';
import protectRedirect from './protectRedirect';
import getCSRFToken from './getCSRFToken';
import Header from './Header'; // 导入新的 Header 组件

function HomePage() {
  // Track user authentication state and username
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState("");

  // Check if user is already logged in when the page loads
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
          const data = await response.json();
          // If authentication check passes, update the login state
          if (data && data.is_authenticated) {
            setIsLogin(true);
            setUsername(data.username);
          }
        }
      } catch (error) {
        console.error("Error fetching authentication status:", error);
      }
    };
    fetchData();  
  }, []);

  // Handle the "Get Started" button click - redirects to profile setup
  const handleGetStarted = () => {
    protectRedirect("", "/ProfileSignUp");
  }

  // Toggle between login and logout functionality
  const handleLogin = () => {
    if (!isLogin) {
      // If not logged in, redirect to registration page
      window.location.href = "/Register";
    } else {
      // If logged in, handle logout process
      fetch(`${process.env.REACT_APP_BACKEND}/api/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRFToken(),
        },
        credentials: 'include',
      })
      .then(response => {
        if (response.ok) {
          setIsLogin(false);
          setUsername("");
        }
      })
    }
  }

  return (
    <div className="HomePage">
      {/* Top navigation bar */}
      <header className="AppHeader">
        <button className="header-button">{username}</button>
        <button className="header-button" onClick={handleLogin}>
          {isLogin ? "Logout" : "Login"}
        </button>
      </header>

      {/* Hero section with main message and call-to-action */}
      <div className="HeaderSection">
        <img className="HeaderImage" src={`${process.env.PUBLIC_URL}/image/header.jpg`} alt="Header" />
        <div className="IntroText">
          <div className="Tagline">
            <span className="home-black-text">Connect. </span>
            <span className="home-highlighted-text">Match</span>
            <span className="home-black-text">.Wag!</span>
          </div>
          <button className="GetStartedButton" onClick={handleGetStarted}>Get Started</button>
        </div>
      </div>

      {/* Brand promise section with paw print */}
      <div className="home-promise-section">
        <div className="home-promise-text">Petpal Promise</div>
        <div className="home-paw-print">
          <div className="home-paw-image">
            <img src={`${process.env.PUBLIC_URL}/image/g3023.svg`} alt="Paw Print" />
          </div>
        </div>
      </div>

      {/* Feature cards showcasing main functionality */}
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


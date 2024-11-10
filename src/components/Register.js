import React from "react";
import illustrationImage from "../assets/illustration-image.png";
import logosGoogleIcon from "../assets/logos-google-icon.svg";
import overlayBackground from "../assets/overlay-background.svg";
import "../styles/Register.css";

export const Register = () => {
  return (
    <div className="login-page">
      <div className="left-section">
        <p className="tagline">
          <span>Happiness </span>
          <br />
          <span>starts here</span>
        </p>
        <img
          className="illustration-image"
          alt="Illustration"
          src={illustrationImage}
        />
      </div>
      <div className="right-section">
        <div className="login-box">
          
          <h1 className="login-title">Login</h1>
          
          <div className="google-login-button">
            <img
              className="google-icon"
              alt="Google icon"
              src={logosGoogleIcon}
            />
            <span>Login with Google</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
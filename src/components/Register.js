import React from "react";
import { GoogleLogin } from "react-google-login";
import illustrationImage from "../assets/illustration-image.png";
import logosGoogleIcon from "../assets/logos-google-icon.svg";
import "../styles/Register.css";

const Register = () => {
    const handleSuccess = (response) => {
        console.log("Google Login Success:", response);
        // 登录后跳转至后端的 Django Google OAuth2 URL
        window.location.href = `http://127.0.0.1:8000/auth/complete/google-oauth2/?code=${response.code}`;
    };

    const handleFailure = (error) => {
        console.error("Google Login Failed:", error);
    };

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
                    <GoogleLogin
                          clientId="1039706282957-6gg8a9pj9vnr77evefotsdgkmce9hh3l.apps.googleusercontent.com" // 后端的 Client ID
                          buttonText="Login with Google"
                          onSuccess={handleSuccess}
                          onFailure={handleFailure}
                          cookiePolicy={"single_host_origin"}
                          scope="profile email"
                      />
                </div>
            </div>
        </div>
    );
};

export default Register;

import React from "react";
// import { GoogleLogin } from "react-google-login";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import illustrationImage from "../assets/illustration-image.png";
import "../styles/Register.css";

const Register = () => {
    const handleSuccess = (response) => {
        console.log("Google Login Success:", response);
        
        // get token from Google response
        const token = response.credential;
        const nextPage = new URLSearchParams(window.location.search).get('next') || '';

        const backendRedirectUrl = `http://localhost:8000/auth/complete/google-oauth2/?token=${encodeURIComponent(token)}&next=${encodeURIComponent(nextPage)}`;

        console.log("Redirect URL:", backendRedirectUrl);

        window.location.href = backendRedirectUrl;

        // window.location.href = `http://127.0.0.1:8000/auth/complete/google-oauth2/?code=${response.code}`;
    };

    const handleFailure = (error) => {
        console.error("Google Login Failed:", error);
    };

    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
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
                        onSuccess={handleSuccess}
                        onError={handleFailure}
                        useOneTap
                      />
                </div>
            </div>
        </div>
        </GoogleOAuthProvider>
    );
};

export default Register;

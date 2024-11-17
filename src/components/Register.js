import React, { useState, useEffect} from "react";
// import { GoogleLogin } from "react-google-login";
import illustrationImage from "../assets/illustration-image.png";
import "../styles/Register.css";

const Register = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const nextPage = encodeURIComponent(searchParams.get("next") || "");

    const handleLoginClick = async () => {
        window.location.href = `${process.env.REACT_APP_BACKEND}/oauth/login/google-oauth2/?next=${nextPage}`;
    }

    // const handleSuccess = (response) => {
    //     console.log("Google Login Success:", response);
        
    //     // get token from Google response
    //     const token = response.credential;
    //     const nextPage = new URLSearchParams(window.location.search).get('next') || '';

    //     const backendRedirectUrl = `http://localhost:8000/auth/complete/google-oauth2/?token=${encodeURIComponent(token)}&next=${encodeURIComponent(nextPage)}`;

    //     console.log("Redirect URL:", backendRedirectUrl);

    //     window.location.href = backendRedirectUrl;

    //     // window.location.href = `http://127.0.0.1:8000/auth/complete/google-oauth2/?code=${response.code}`;
    // };

    // const handleFailure = (error) => {
    //     console.error("Google Login Failed:", error);
    // };

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
                    <div className="google-signin-wrapper" style={{ position: 'relative' }}>
                <div>
                    <div tabIndex="0" role="button" aria-labelledby="button-label" className="google-signin-button" onClick={handleLoginClick}>
                        <div className="google-signin-button-icon">
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="google-icon">
                                <g>
                                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                                    ></path>
                                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                                    ></path>
                                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                    <path fill="none" d="M0 0h48v48H0z"></path>
                                </g>
                            </svg>
                        </div>
                        <span className="google-signin-button-text">Sign in with Google</span>
                        <span className="sr-only" id="button-label">Sign in with Google</span>
                    </div>
                </div>
            </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

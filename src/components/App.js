// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import ProfileSignUp from './pet_register';

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/register" element={<ProfileSignUp />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import ProfileSignUp from './ProfileSignUp';
import Register from './Register';

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/ProfileSignUp" element={<ProfileSignUp />} />
                    <Route path="/Register" element={<Register />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
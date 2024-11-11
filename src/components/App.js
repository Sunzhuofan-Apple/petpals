// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import ProfileSignUp from './ProfileSignUp';
import Register from './Register';
import AddPhoto from './AddPhoto';
import Characters from './Characters';
import RedFlags from './RedFlags';
import Transition from './Transition';

function App() {
    const [petName, setPetName] = useState("");

    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route 
                        path="/ProfileSignUp" 
                        element={<ProfileSignUp setPetName={setPetName} />} 
                    />
                    <Route path="/Register" element={<Register />} />
                    <Route 
                        path="/AddPhoto" 
                        element={<AddPhoto petName={petName} />} 
                    />
                    <Route path="/Characters" element={<Characters />} />
                    <Route path="/RedFlags" element={<RedFlags />} />
                    <Route path="/Transition" element={<Transition />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
import React, { useState } from 'react';
import Select from 'react-select';
import '../styles/ProfileSignUp.css';

export const ProfileSignUp = () => {
    const [birth, setBirth] = useState("");
    // Health State options
    const healthOptions = [
        { value: 'rabies', label: 'Rabies' },
        { value: 'dhlpp', label: 'DHLPP (Distemper, Hepatitis, Leptospirosis, Parainfluenza, Parvovirus)' },
        { value: 'bordetella', label: 'Bordetella' },
        { value: 'heartworm', label: 'Heartworm Prevention' },
        { value: 'lyme', label: 'Lyme Disease' },
        { value: 'leptospirosis', label: 'Leptospirosis' },
        { value: 'influenza', label: 'Canine Influenza' }
    ];

    // Birth validation handler
    const handleBirthChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^[0-9/]*$/.test(value)) {
            if (value.length <= 7) {
                setBirth(value);
                
                if (value.length === 2 && !value.includes('/')) {
                    setBirth(value + '/');
                }
            }
        }
    };
    return (
        <div className="profile-signup">
            <header className="AppHeader">
                <button className="header-button">Home</button>
                <button className="header-button">Login</button>
                <button className="header-button">Register</button>
      </header>

            <div className="form-container">
                <h2 className="profile-title">Profile Sign Up</h2>
                <div className="form-grid">
                    <label>
                        Pet name
                        <input 
                            type="text" 
                            className="input-field" 
                            placeholder="Enter pet's name" 
                        />
                    </label>
                    <label>
                        Sex
                        <select className="input-field">
                            <option value="">Select sex</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="neutered">Neutered</option>
                        </select>
                    </label>
                    <label>
                        Location
                        <input type="text" className="input-field" placeholder="Enter location" id="location-field" />
                    </label>
                    <label>
                        Prefer dog-walking time slots
                        <select className="input-field">
                            <option value="">Select time slot</option>
                            <option value="morning">Morning (6-9 AM)</option>
                            <option value="midday">Midday (11 AM - 2 PM)</option>
                            <option value="afternoon">Afternoon (3-6 PM)</option>
                            <option value="evening">Evening (6-9 PM)</option>
                        </select>
                    </label>
                    <label>
                        Breed
                        <select className="input-field">
                            <option value="">Select breed</option>
                            <option value="labrador">Labrador Retriever</option>
                            <option value="golden">Golden Retriever</option>
                            <option value="german_shepherd">German Shepherd</option>
                            <option value="bulldog">Bulldog</option>
                            <option value="poodle">Poodle</option>
                            <option value="beagle">Beagle</option>
                            <option value="rottweiler">Rottweiler</option>
                            <option value="dachshund">Dachshund</option>
                            <option value="boxer">Boxer</option>
                            <option value="husky">Siberian Husky</option>
                        </select>
                    </label>
                    <label>
                        Birth (month/year)
                        <input
                            type="text"
                            className="input-field"
                            placeholder="MM/YYYY"
                            value={birth}
                            onChange={handleBirthChange}
                        />
                    </label>
                    <label>
                        Weight (LBS)
                        <input type="number" className="input-field" placeholder="Enter weight" min="1" />
                    </label>
                    <label>
                        Health State
                        <Select
                            isMulti
                            options={healthOptions}
                            className="no-border"
                            classNamePrefix="select"
                            placeholder="Select health state"
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    border: '1px solid #9F9F9F',
                                    boxShadow: 'none',
                                    minHeight: '42px',
                                    backgroundColor: 'white'
                                }),
                                multiValueLabel: (base) => ({
                                    ...base,
                                    color: '#735858'
                                }),
                                // 隐藏下拉指示器（箭头）
                                dropdownIndicator: () => ({
                                    display: 'none'
                                }),
                                // 隐藏分隔线
                                indicatorSeparator: () => ({
                                    display: 'none'
                                }),
                                // 确保文字颜色一致
                                placeholder: (base) => ({
                                    ...base,
                                    color: '#735858'
                                })
                            }}
                        />
                    </label>
                </div>
                <button className="next-button">Next</button>
            </div>
        </div>
    );
};

export default ProfileSignUp;
import React, { useState } from "react";
import "../styles/ProfileSignUp.css"; // Consolidate CSS files into one
import "../styles/AddPhoto.css";
import "../styles/Characters.css";
import "../styles/RedFlags.css";

const SignupPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    sex: "",
    preferred_time: "",
    breed: "",
    birth_date: "",
    location: "",
    weight: "",
    health_states: [],
    photos: Array(6).fill(null),
    characteristics: [],
    redFlags: [],
  });

  // Handlers for each form section
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOptions) => {
    const healthStates = selectedOptions.map((option) => option.value);
    setFormData((prev) => ({
      ...prev,
      health_states: healthStates,
    }));
  };

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    const updatedPhotos = [...formData.photos];

    files.forEach((file) => {
      const firstEmptyIndex = updatedPhotos.indexOf(null);
      if (firstEmptyIndex !== -1) {
        updatedPhotos[firstEmptyIndex] = URL.createObjectURL(file);
      }
    });

    setFormData((prev) => ({
      ...prev,
      photos: updatedPhotos,
    }));
  };

  const handleDeletePhoto = (index) => {
    const updatedPhotos = formData.photos
      .filter((_, i) => i !== index)
      .concat(null);
    setFormData((prev) => ({
      ...prev,
      photos: updatedPhotos,
    }));
  };

  const handleCharacterSelect = (character) => {
    setFormData((prev) => {
      const isSelected = prev.characteristics.includes(character);
      const updatedCharacteristics = isSelected
        ? prev.characteristics.filter((c) => c !== character)
        : prev.characteristics.length < 3
        ? [...prev.characteristics, character]
        : prev.characteristics;

      return {
        ...prev,
        characteristics: updatedCharacteristics,
      };
    });
  };

  const handleFlagSelect = (flag) => {
    setFormData((prev) => {
      const isSelected = prev.redFlags.includes(flag);
      const updatedFlags = isSelected
        ? prev.redFlags.filter((f) => f !== flag)
        : prev.redFlags.length < 3
        ? [...prev.redFlags, flag]
        : prev.redFlags;

      return {
        ...prev,
        redFlags: updatedFlags,
      };
    });
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    console.log("Submitted Data:", formData);
    alert("Form submitted successfully!");
  };

  return (
    <div className="pet-info-form">
      <h1>Pet Information</h1>
      <div className="form-content">
        {currentStep === 1 && (
          <div className="step">
            <h2>Profile Sign Up</h2>
            {/* ProfileSignUp fields */}
            <form className="form-grid">
              <label>
                Pet Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </label>
              <label>
                Birth Date:
                <input
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </label>
              {/* Other fields... */}
            </form>
          </div>
        )}
        {currentStep === 2 && (
          <div className="step">
            <h2>Add Photos</h2>
            <div className="photo-grid">
              {formData.photos.map((photo, index) => (
                <div className="photo-frame" key={index}>
                  {photo ? (
                    <div className="photo-container">
                      <img src={photo} alt={`Pet ${index + 1}`} className="photo" />
                      <button
                        className="delete-button"
                        onClick={() => handleDeletePhoto(index)}
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <button className="add-photo-button">
                      Add Photo
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {currentStep === 3 && (
          <div className="step">
            <h2>Characteristics</h2>
            {/* Characters component */}
          </div>
        )}
        {currentStep === 4 && (
          <div className="step">
            <h2>Red Flags</h2>
            {/* RedFlags component */}
          </div>
        )}
      </div>
      <div className="navigation-buttons">
        <button onClick={handleBack} disabled={currentStep === 1}>
          Back
        </button>
        {currentStep < 4 ? (
          <button onClick={handleNext}>Next</button>
        ) : (
          <button onClick={handleSubmit}>Submit</button>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
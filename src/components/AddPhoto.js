import React, { useState, useRef } from "react";
import "../styles/AddPhoto.css";

export const AddPhoto = () => {
    const [photos, setPhotos] = useState(Array(6).fill(null));
    const fileInputRef = useRef(null); 

    const handlePhotoUpload = (event) => {
        const files = Array.from(event.target.files); 
        const updatedPhotos = [...photos];

        files.forEach((file, index) => {
            const firstEmptyIndex = updatedPhotos.indexOf(null); 
            if (firstEmptyIndex !== -1) {
                updatedPhotos[firstEmptyIndex] = URL.createObjectURL(file); 
            }
        });

        setPhotos(updatedPhotos); 
    };


    const triggerFileInput = () => {
        fileInputRef.current.click();
    };


    const handleDeletePhoto = (index) => {
        const updatedPhotos = photos.filter((photo, i) => i !== index) 
            .concat(null); 
        setPhotos(updatedPhotos);
    };

    return (
        <div className="adding-photos">
            <h2 className="title">Adding photos for [Pet's name]!</h2>
            <div className="photo-grid">
                {photos.map((photo, index) => (
                    <div className="photo-frame" key={index}>
                        {photo ? (
                            <div className="photo-container">
                                <img src={photo} alt={`Pet ${index + 1}`} className="photo" />
                                <button 
                                    className="delete-button"
                                    onClick={() => handleDeletePhoto(index)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <button className="add-photo-button" onClick={triggerFileInput}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </button>
                        )}
                    </div>
                ))}
            </div>
            <p className="photo-count">{photos.filter((photo) => photo !== null).length}/6</p>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="upload-input"
            />
            <button className="button">Next</button>
        </div>
    );
};

export default AddPhoto;
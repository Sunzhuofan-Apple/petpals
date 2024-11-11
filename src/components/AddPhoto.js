import React, { useState, useRef } from "react";
import "../styles/AddPhoto.css";

export const AddPhoto = () => {
    // 用于存储最多 6 张照片的状态数组
    const [photos, setPhotos] = useState(Array(6).fill(null));
    const fileInputRef = useRef(null); // 添加 ref 用于触发文件选择

    // 上传照片事件处理函数
    const handlePhotoUpload = (event) => {
        const files = Array.from(event.target.files); // 获取文件
        const updatedPhotos = [...photos];

        files.forEach((file, index) => {
            const firstEmptyIndex = updatedPhotos.indexOf(null); // 找到第一个空位
            if (firstEmptyIndex !== -1) {
                updatedPhotos[firstEmptyIndex] = URL.createObjectURL(file); // 将照片放到空位
            }
        });

        setPhotos(updatedPhotos); // 更新状态
    };

    // 添加触发文件选择的函数
    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    // 修改删除照片的函数
    const handleDeletePhoto = (index) => {
        const updatedPhotos = photos.filter((photo, i) => i !== index) // 移除被删除的照片
            .concat(null); // 在末尾添加一个空位
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
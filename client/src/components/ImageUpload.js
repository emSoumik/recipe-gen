import React, { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiCamera } from 'react-icons/fi';
import './ImageUpload.css';

const ImageUpload = ({ onImageUpload, isLoading }) => {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setPreview(reader.result);
        onImageUpload(file);
      };
      
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    multiple: false,
    disabled: isLoading
  });

  const handleCameraCapture = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onImageUpload(file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="image-upload-container">
      <div 
        {...getRootProps()} 
        className={`dropzone ${isDragActive ? 'active' : ''} ${isLoading ? 'disabled' : ''}`}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="preview-container">
            <img src={preview} alt="Preview" className="image-preview" />
            {!isLoading && (
              <button 
                className="change-image-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  setPreview(null);
                }}
              >
                Change Image
              </button>
            )}
          </div>
        ) : (
          <div className="upload-message">
            <FiUpload className="upload-icon" />
            <p>{isDragActive ? 'Drop the image here' : 'Drag & drop an image here, or click to select'}</p>
          </div>
        )}
      </div>

      {isMobile && !isLoading && (
        <div className="mobile-upload-options">
          <button 
            className="camera-button" 
            onClick={handleCameraCapture}
            disabled={isLoading}
          >
            <FiCamera /> Use Camera
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            capture="environment"
            className="hidden-input"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

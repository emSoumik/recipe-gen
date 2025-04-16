import React, { useState } from 'react';
import axios from 'axios';
import ImageUpload from '../components/ImageUpload';
import RecipeDisplay from '../components/RecipeDisplay';
import ApiKeyInput from '../components/ApiKeyInput';
import './Home.css';

// Configure axios to use the server URL based on environment
const API_URL = process.env.REACT_APP_API_URL || (
  process.env.NODE_ENV === 'production' 
    ? '/.netlify/functions/api'
    : 'http://localhost:3000'
);

axios.defaults.baseURL = API_URL;

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recipe, setRecipe] = useState(null);
  const [detectedIngredients, setDetectedIngredients] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [apiKeyProvided, setApiKeyProvided] = useState(false);

  const handleApiKeySubmit = (key) => {
    setApiKey(key);
    setApiKeyProvided(!!key);
    setError(null);
  };

  const handleImageUpload = async (file) => {
    if (!apiKeyProvided) {
      setError('Please provide a Google Gemini API key to continue.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecipe(null);
    setDetectedIngredients(null);
    
    // Create form data for file upload
    const formData = new FormData();
    formData.append('image', file);
    formData.append('apiKey', apiKey);
    
    try {
      const response = await axios.post('/api/analyze-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000 // 30 second timeout
      });

      // Handle error from backend
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      if (!response.data.recipe || !response.data.detectedIngredients) {
        throw new Error('Invalid response from server. Please try again.');
      }

      setDetectedIngredients(response.data.detectedIngredients);
      setRecipe(response.data.recipe);
    } catch (err) {
      console.error('Error uploading image:', err);
      setRecipe(null);
      setDetectedIngredients(null);
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'An error occurred while analyzing the image. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-view">
      <section className="api-key-section">
        <h2>Google Gemini API Key</h2>
        <p className="section-description">
          Enter your Google Gemini API key to use the recipe generator
        </p>
        <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} isRequired={true} />
      </section>

      <section className="upload-section">
        <h2>Upload Food Image</h2>
        <p className="section-description">
          Upload a photo of your refrigerator or individual food items to get recipe suggestions
        </p>
        <ImageUpload onImageUpload={handleImageUpload} isLoading={isLoading} disabled={!apiKeyProvided} />
        
        {error && (
          <div className="error-message" role="alert">
            <p>{error}</p>
          </div>
        )}
      </section>
      
      <section className="recipe-section">
        <RecipeDisplay 
          recipe={recipe} 
          detectedIngredients={detectedIngredients}
          isLoading={isLoading} 
        />
      </section>
    </div>
  );
};

export default Home;

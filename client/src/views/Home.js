import React, { useState } from 'react';
import axios from 'axios';
import ImageUpload from '../components/ImageUpload';
import RecipeDisplay from '../components/RecipeDisplay';
import './Home.css';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recipe, setRecipe] = useState(null);
  const [detectedIngredients, setDetectedIngredients] = useState(null);

  const handleImageUpload = async (file) => {
    setIsLoading(true);
    setError(null);
    setRecipe(null);
    setDetectedIngredients(null);
    
    // Create form data for file upload
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await axios.post('/api/analyze-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setDetectedIngredients(response.data.detectedIngredients);
      setRecipe(response.data.recipe);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(
        err.response?.data?.message || 
        'An error occurred while analyzing the image. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-view">
      <section className="upload-section">
        <h2>Upload Food Image</h2>
        <p className="section-description">
          Upload a photo of your refrigerator or individual food items to get recipe suggestions
        </p>
        <ImageUpload onImageUpload={handleImageUpload} isLoading={isLoading} />
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
      </section>
      
      {(isLoading || recipe || detectedIngredients) && (
        <section className="recipe-section">
          <RecipeDisplay 
            recipe={recipe} 
            detectedIngredients={detectedIngredients}
            isLoading={isLoading} 
          />
        </section>
      )}
    </div>
  );
};

export default Home;

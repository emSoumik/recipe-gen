import React from 'react';
import './RecipeDisplay.css';

const RecipeDisplay = ({ recipe, detectedIngredients, isLoading }) => {
  if (isLoading) {
    return (
      <div className="recipe-loading" role="status">
        <div className="loading-spinner"></div>
        <p>Analyzing your ingredients and generating delicious recipes...</p>
      </div>
    );
  }

  // Return null if no data and not loading
  if (!recipe && !detectedIngredients) {
    return null;
  }

  return (
    <div className="recipe-display">
      {detectedIngredients && detectedIngredients.length > 0 && (
        <div className="detected-ingredients">
          <h3>Detected Ingredients</h3>
          <ul>
            {detectedIngredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
      )}

      {recipe ? (
        <div className="recipe-content">
          <h2>{recipe.title}</h2>
          
          {recipe.description && (
            <div className="recipe-description">
              <p>{recipe.description}</p>
            </div>
          )}
          
          <div className="recipe-details">
            {recipe.prepTime && (
              <div className="recipe-time">
                <span>Prep Time:</span> {recipe.prepTime}
              </div>
            )}
            {recipe.cookTime && (
              <div className="recipe-time">
                <span>Cook Time:</span> {recipe.cookTime}
              </div>
            )}
            {recipe.servings && (
              <div className="recipe-servings">
                <span>Servings:</span> {recipe.servings}
              </div>
            )}
          </div>
          
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div className="recipe-ingredients">
              <h3>Ingredients</h3>
              <ul>
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
          )}
          
          {recipe.instructions && recipe.instructions.length > 0 && (
            <div className="recipe-instructions">
              <h3>Instructions</h3>
              <ol>
                {recipe.instructions.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          )}
          
          {recipe.tips && (
            <div className="recipe-tips">
              <h3>Tips</h3>
              <p>{recipe.tips}</p>
            </div>
          )}
        </div>
      ) : detectedIngredients && detectedIngredients.length > 0 ? (
        <div className="no-recipe-message">
          <p>No recipe was generated. Please try again with a different image.</p>
        </div>
      ) : null}
    </div>
  );
};

export default RecipeDisplay;

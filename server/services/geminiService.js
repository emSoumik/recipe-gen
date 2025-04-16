const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    // No longer initializing with environment variables
    // Will create instances on demand with provided API key
  }

  async analyzeImageAndGenerateRecipe(imageBuffer, mimeType, apiKey, retries = 3) {
    if (!apiKey) {
      throw new Error('API key is required');
    }

    // Initialize the Gemini client with the provided API key
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    let lastError;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const base64Image = imageBuffer.toString('base64');
        
        const imageData = {
          inlineData: {
            data: base64Image,
            mimeType: mimeType,
          },
        };

        // First, detect ingredients with a more specific prompt
        const ingredientPrompt = "You are a professional chef. Look at this food image and list all visible food items, ingredients, and products. Be specific but concise. Format as a simple list.";
        const ingredientResult = await model.generateContent([
          { text: ingredientPrompt },
          imageData
        ]);
        const ingredientResponse = await ingredientResult.response;
        
        const detectedIngredients = ingredientResponse.text()
          .split('\n')
          .map(item => item.trim().replace(/^[•\-\d]+\.?\s*/, ''))
          .filter(item => item && !item.toLowerCase().includes('image') && !item.toLowerCase().includes('list'));

        if (detectedIngredients.length === 0) {
          throw new Error('No ingredients detected in the image. Please try a clearer image of food items.');
        }

        // Generate recipe with a more structured prompt
        const recipePrompt = `
          You are a professional chef. Create a delicious recipe using these ingredients: ${detectedIngredients.join(', ')}.
          Format the response as a JSON object with exactly this structure:
          {
            "title": "A creative recipe name",
            "description": "A brief, appetizing description",
            "prepTime": "Preparation time in minutes",
            "cookTime": "Cooking time in minutes",
            "servings": "Number of servings",
            "ingredients": ["Complete list of ingredients with quantities"],
            "instructions": ["Clear, step-by-step cooking instructions"],
            "tips": "Helpful cooking tips and suggestions"
          }
          Ensure the response is valid JSON. Do not include any markdown formatting or code blocks.
        `;

        const recipeResult = await model.generateContent(recipePrompt);
        const recipeResponse = await recipeResult.response;
        const recipeText = recipeResponse.text().replace(/```json\s*|\s*```/g, '').trim();
        
        let recipe;
        try {
          recipe = JSON.parse(recipeText);
          
          // Validate recipe structure
          const requiredFields = ['title', 'description', 'prepTime', 'cookTime', 'servings', 'ingredients', 'instructions'];
          const missingFields = requiredFields.filter(field => !recipe[field]);
          
          if (missingFields.length > 0) {
            throw new Error(`Invalid recipe format: missing ${missingFields.join(', ')}`);
          }
        } catch (jsonError) {
          console.error('Error parsing recipe JSON:', jsonError);
          console.log('Raw recipe text:', recipeText);
          throw new Error('Failed to generate a valid recipe. Please try again.');
        }

        return {
          success: true,
          detectedIngredients,
          recipe
        };
      } catch (error) {
        lastError = error;
        console.error(`Attempt ${attempt} failed:`, error.message);
        
        if (attempt === retries) {
          throw new Error(`Recipe generation failed: ${error.message}`);
        }
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, attempt), 10000)));
      }
    }
  }
}

module.exports = new GeminiService();

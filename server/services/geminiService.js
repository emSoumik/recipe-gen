const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      throw new Error('GOOGLE_GEMINI_API_KEY is required');
    }
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  async analyzeImageAndGenerateRecipe(imageBuffer, mimeType, retries = 3) {
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

        // First, detect ingredients
        const ingredientPrompt = "List all visible food items in this image. Be specific but concise. Table Format.";
        const ingredientResult = await this.model.generateContent([ingredientPrompt, imageData]);
        const ingredientResponse = await ingredientResult.response;
        
        const detectedIngredients = ingredientResponse.text()
          .split('\n')
          .map(item => item.trim())
          .filter(item => item && !item.toLowerCase().includes('image'));

        if (detectedIngredients.length === 0) {
          throw new Error('No ingredients detected in the image');
        }

        // Generate recipe
        const recipePrompt = `
          Create a recipe using these ingredients: ${detectedIngredients.join(', ')}.
          Return a JSON object with:
          {
            "title": "Recipe name",
            "description": "Brief description",
            "prepTime": "Prep time",
            "cookTime": "Cook time",
            "servings": "Number of servings",
            "ingredients": ["List with quantities"],
            "instructions": ["Step by step instructions"],
            "tips": "Cooking tips"
          }
        `;

        const recipeResult = await this.model.generateContent(recipePrompt);
        const recipeResponse = await recipeResult.response;
        const recipeText = recipeResponse.text().replace(/```json\s*|\s*```/g, '');
        
        const recipe = JSON.parse(recipeText);

        return {
          success: true,
          detectedIngredients,
          recipe
        };
      } catch (error) {
        lastError = error;
        if (attempt === retries) {
          throw new Error(`Failed after ${retries} attempts: ${error.message}`);
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
}

module.exports = new GeminiService();

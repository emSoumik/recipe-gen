const geminiService = require('../services/geminiService');

/**
 * Analyze food image and generate recipe
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.analyzeImage = async (req, res, next) => {
  try {
    // Check if image file is provided
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Check if API key is provided
    const apiKey = req.body.apiKey;
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    // Get image data
    const imageBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    // Process image with Gemini API
    const result = await geminiService.analyzeImageAndGenerateRecipe(imageBuffer, mimeType, apiKey);

    // Ensure the response is always in the expected format
    if (result && result.success && result.detectedIngredients && result.recipe) {
      return res.status(200).json({
        success: true,
        detectedIngredients: result.detectedIngredients,
        recipe: result.recipe
      });
    } else {
      return res.status(500).json({ error: 'Invalid response from AI service.' });
    }
  } catch (error) {
    console.error('Error in image analysis:', error);
    // Always return an error object
    return res.status(500).json({ error: error.message || 'An error occurred during image analysis.' });
  }
};

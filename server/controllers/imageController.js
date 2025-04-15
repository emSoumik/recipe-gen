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
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Get image data
    const imageBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    // Process image with Gemini API
    const result = await geminiService.analyzeImageAndGenerateRecipe(imageBuffer, mimeType);

    // Return the response
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in image analysis:', error);
    
    if (error.message.includes('API key')) {
      return res.status(401).json({ message: 'API key error. Please check your Gemini API key configuration.' });
    }
    
    if (error.message.includes('image')) {
      return res.status(400).json({ message: 'Invalid image or image format not supported.' });
    }
    
    next(error);
  }
};

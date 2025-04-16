const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables (not needed for API key anymore, but kept for other potential env vars)
dotenv.config();

// Create express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configure multer for image upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(
      new Error('Error: File upload only supports the following filetypes - ' + filetypes)
    );
  },
});

// API Routes
app.post('/analyze-image', upload.single('image'), async (req, res, next) => {
  try {
    // Check if image file is provided
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Check if API key is provided
    const apiKey = req.body.apiKey;
    if (!apiKey) {
      return res.status(400).json({ message: 'API key is required' });
    }

    // Get image data
    const imageBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    // Initialize Gemini API with the provided API key
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Process image with Gemini API
    let lastError;
    const retries = 3;
    
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
        const ingredientResult = await model.generateContent([ingredientPrompt, imageData]);
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

        const recipeResult = await model.generateContent(recipePrompt);
        const recipeResponse = await recipeResult.response;
        const recipeText = recipeResponse.text().replace(/```json\s*|\s*```/g, '');
        
        let recipe;
        try {
          recipe = JSON.parse(recipeText);
        } catch (jsonError) {
          console.error('Error parsing recipe JSON:', jsonError);
          console.log('Raw recipe text:', recipeText);
          throw new Error('Failed to parse recipe data');
        }

        res.status(200).json({
          success: true,
          detectedIngredients,
          recipe
        });
        
        // Important: Return here to prevent further execution
        return;
      } catch (error) {
        lastError = error;
        console.error(`Attempt ${attempt} failed:`, error.message);
        
        if (attempt === retries) {
          throw new Error(`Failed after ${retries} attempts: ${error.message}`);
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  } catch (error) {
    console.error('Error in image analysis:', error);
    
    if (error.message.includes('API key')) {
      return res.status(401).json({ message: 'Invalid API key. Please check your Google Gemini API key.' });
    }
    
    if (error.message.includes('image')) {
      return res.status(400).json({ message: 'Invalid image or image format not supported.' });
    }
    
    return res.status(500).json({ 
      success: false,
      message: `Error processing image: ${error.message}` 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[Error] ${err.stack}`);
  
  const statusCode = err.statusCode || 500;
  const message = 'An internal server error occurred';

  res.status(statusCode).json({
    success: false,
    message
  });
});

// Export the serverless function
module.exports.handler = serverless(app);

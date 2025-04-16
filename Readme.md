# AI Project: Food Image Scanner & Recipe Generator

## Project Overview
Build a web application that uses advanced AI to scan photos of refrigerators or individual food items, identify their contents, and generate creative recipes based on the detected ingredients. The solution leverages the Google Gemini 2.0 Flash model for deep image analysis and natural language-based recipe generation. The application must support both desktop and mobile devices, featuring a drag-and-drop or upload interface on desktop and photo upload or camera capture on mobile.

## Objectives
- **Image Analysis:** Automatically detect and classify food items in photos.
- **Recipe Generation:** Produce creative recipes using the detected ingredients.
- **Model Integration:** Integrate with the Google Gemini 2.0 Flash model through secured API calls.
- **Responsive UI:** Implement a clean, minimalistic design optimized for both desktop and mobile interfaces.
- **Environment & Security:** Utilize environment variables (e.g., a .env file) to manage API keys and other sensitive configurations securely.

## Key Features
- Multi-Modal Image Input: Desktop (drag-and-drop/file upload) and Mobile (camera/photo upload)
- AI-Powered Recipe Generation
- Minimal, Responsive UI
- Secure Configuration Management (.env file)
- Optimized Performance

## Installation

### Prerequisites
- Node.js (v14 or higher)
- Google Gemini API key

### Setup Instructions

1. Clone the repository (adjust directory name as needed)
```bash
git clone https://github.com/emSoumik/recipe-gen.git
cd "recipe gen"
```

2. Setup environment variables

If you have an `.env.example` (now provided), copy it to create your `.env` file:
```bash
cp server/.env.example server/.env
```
Edit the `.env` file and add your Google Gemini API key.

If you do not wish to copy, you can manually create `server/.env` with the following content:
```env
GOOGLE_GEMINI_API_KEY=your_google_gemini_api_key_here
NODE_ENV=development
PORT=3000
```

3. Install all dependencies (frontend and backend)
```bash
npm run install-all
```

## Usage

### Development Mode

Run both frontend and backend concurrently:
```bash
npm start
```

Or run them separately:
```bash
# Backend only
npm run server

# Frontend only
npm run client
```

The application will be available at:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000/api

### Production Deployment

Build and run the application in production mode:
```bash
npm run prod
```

This will:
1. Build the React frontend
2. Copy the build files to the server's public directory
3. Start the server in production mode

The application will be available at http://localhost:3000

Alternatively, you can use Docker:
```bash
docker build -t food-image-recipe-generator -f docker/Dockerfile .
docker run -p 3000:3000 -e GOOGLE_GEMINI_API_KEY=your_key_here food-image-recipe-generator
```

## API Details

- **Endpoint:** `POST /api/analyze-image`
- **Request:** `multipart/form-data`
  - `image`: image file
  - `apiKey`: your Google Gemini API key
- **Response:**
  - On success:
    ```json
    {
      "success": true,
      "detectedIngredients": ["ingredient1", "ingredient2", ...],
      "recipe": {
        "title": "...",
        "description": "...",
        "prepTime": "...",
        "cookTime": "...",
        "servings": "...",
        "ingredients": ["..."],
        "instructions": ["..."],
        "tips": "..."
      }
    }
    ```
  - On error:
    ```json
    { "error": "...error message..." }
    ```

## Model Used
- Uses `gemini-2.0-flash` for image analysis and recipe generation (see `server/services/geminiService.js`).

## Technology Stack
- **Frontend:** React.js or Vue.js, CSS3/SCSS, Flexbox/Grid
- **Backend:** Node.js, RESTful/GraphQL APIs
- **AI Integration:** Google Gemini 2.0 Flash model
- **Deployment:** Docker, CI/CD pipelines
- **Environment:** `.env` for API keys using `dotenv`

## Project Structure
```
Food-Image-Recipe-Generator/
├── client/                       # Frontend code (React.js/Vue.js)
│   ├── public/                   # Static files and the main HTML template
│   ├── src/
│   │   ├── components/           # UI components (upload module, preview pane, etc.)
│   │   ├── views/                # Pages (Home, Recipe Display, Error Pages)
│   │   ├── App.js                # Main application file
│   │   └── index.js              # Entry point for the app
│   ├── package.json              # Frontend dependencies & scripts
│   └── README.md                 # Frontend-specific docs
├── server/                       # Backend code (Node.js)
│   ├── controllers/              # Logic for image processing and recipe generation
│   ├── routes/                   # API route definitions
│   ├── services/                 # Integration modules (Google Gemini API client)
│   ├── app.js                    # Main server file
│   ├── package.json              # Dependencies for the backend
│   └── .env                      # Environment variables file (not tracked in VCS)
├── docker/                       # Docker configuration files
│   └── Dockerfile
├── .gitignore                    # Git ignore file (ensure .env is excluded)
└── README.md                     # Project overview and global documentation
```

## UI/UX Design Considerations
- Minimal & clean interface
- Responsive design across desktop and mobile
- Clear user guidance and feedback messages

## Architectural Overview
1. Frontend (image upload, responsive UI)
2. Backend (API routes, Gemini model integration)
3. Secure API access with .env
4. Containerized deployment via Docker

## Development Milestones
1. Setup & Basic UI
2. Model Integration
3. Design Optimization
4. Testing & Deployment

## Environment Setup
```
# .env
GOOGLE_GEMINI_API_KEY=your_google_gemini_api_key_here
NODE_ENV=development
PORT=3000
```

## Troubleshooting
- **Blank output?** Ensure both frontend and backend are running. Check browser console and backend logs for errors.
- **404 on `/analyze-image`?** The frontend must POST to `/api/analyze-image`.
- **CORS errors?** Backend must have CORS enabled (see `server/app.js`).
- **Gemini API errors?** Ensure your API key is valid and has access to Gemini 2.0 Flash.

## Final Notes
- Separate documentation for frontend/backend if needed
- Continuous testing & improvement
- Secure handling of all credentials

---

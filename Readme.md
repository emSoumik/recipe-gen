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

1. Clone the repository
```bash
git clone https://github.com/yourusername/food-image-recipe-generator.git
cd food-image-recipe-generator
```

2. Setup environment variables
```bash
cp .env.example .env
```
Edit the `.env` file and add your Google Gemini API key.

3. Install backend dependencies
```bash
cd server
npm install
```

4. Install frontend dependencies
```bash
cd ../client
npm install
```

## Usage

### Development Mode

1. Start the backend server
```bash
cd server
npm run dev
```

2. Start the frontend development server
```bash
cd client
npm start
```

3. Open your browser and navigate to http://localhost:3000

### Production Deployment

1. Build the frontend
```bash
cd client
npm run build
```

2. Start the server in production mode
```bash
cd ../server
NODE_ENV=production npm start
```

Alternatively, you can use Docker:
```bash
docker build -t food-image-recipe-generator -f docker/Dockerfile .
docker run -p 3000:3000 -e GOOGLE_GEMINI_API_KEY=your_key_here food-image-recipe-generator
```

## Technology Stack
- **Frontend:** React.js or Vue.js, CSS3/SCSS, Flexbox/Grid
- **Backend:** Node.js or Python, RESTful/GraphQL APIs
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
├── server/                       # Backend code (Node.js/Python)
│   ├── controllers/              # Logic for image processing and recipe generation
│   ├── routes/                   # API route definitions
│   ├── services/                 # Integration modules (Google Gemini API client)
│   ├── app.js or main.py         # Main server file
│   ├── package.json or requirements.txt  # Dependencies for the backend
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

## Final Notes
- Separate documentation for frontend/backend if needed
- Continuous testing & improvement
- Secure handling of all credentials

---

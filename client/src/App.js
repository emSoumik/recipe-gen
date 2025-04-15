import React, { useEffect, useState } from 'react';
import './App.css';
import Home from './views/Home';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate a slight delay for entrance animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`App ${isLoaded ? 'animated' : ''}`}>
      <header className="app-header">
        <div className="container">
          <h1>Food Image Scanner & Recipe Generator</h1>
          <p>Upload a photo of your food items and get delicious recipe suggestions powered by AI!</p>
        </div>
      </header>
      <main className="container">
        <Home />
      </main>
      <footer className="app-footer">
        <div className="container">
          <p>Powered by Google Gemini 2.0 Flash model • Made with ❤️</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

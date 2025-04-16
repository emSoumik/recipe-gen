import React, { useState, useEffect } from 'react';
import './ApiKeyInput.css';

const ApiKeyInput = ({ onApiKeySubmit, isRequired }) => {
  const [apiKey, setApiKey] = useState('');
  const [isStored, setIsStored] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  useEffect(() => {
    const storedApiKey = localStorage.getItem('geminiApiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setIsStored(true);
      onApiKeySubmit(storedApiKey);
    } else {
      setIsExpanded(true);
    }
  }, [onApiKeySubmit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('geminiApiKey', apiKey);
      setIsStored(true);
      setIsExpanded(false);
      onApiKeySubmit(apiKey);
    }
  };

  const handleClear = () => {
    localStorage.removeItem('geminiApiKey');
    setApiKey('');
    setIsStored(false);
    setShowKey(false);
    setIsExpanded(true);
    onApiKeySubmit('');
  };

  const handleShow = () => {
    setShowKey(!showKey);
    setIsExpanded(true);
  };

  return (
    <div className="api-key-container">
      {isStored && !isExpanded ? (
        <div className="stored-key-container">
          <div className="key-status">
            <span className="checkmark">✓</span>
            <p className="success-message">API key is saved</p>
          </div>
          <div className="button-group">
            <button onClick={handleShow} className="action-button show-button">
              {showKey ? 'Hide Key' : 'Show Key'}
            </button>
            <button onClick={handleClear} className="action-button change-button">
              Change Key
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="api-key-form">
          <div className="input-group">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Google Gemini API key"
              required={isRequired}
              className="api-key-input"
            />
            <button 
              type="button" 
              className="visibility-toggle"
              onClick={() => setShowKey(!showKey)}
              aria-label={showKey ? "Hide API key" : "Show API key"}
            >
              {showKey ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          <div className="button-row">
            <button type="submit" className="submit-button" disabled={!apiKey.trim()}>
              Save API Key
            </button>
            {isStored && (
              <button 
                type="button" 
                onClick={() => {
                  setIsExpanded(false);
                  setShowKey(false);
                }} 
                className="cancel-button"
              >
                Cancel
              </button>
            )}
          </div>
          <p className="api-key-help">
            Don't have an API key? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Get one here</a>
          </p>
        </form>
      )}
    </div>
  );
};

export default ApiKeyInput;

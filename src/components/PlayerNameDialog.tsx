import React, { useState } from 'react';
import './PlayerNameDialog.css';

interface PlayerNameDialogProps {
  isOpen: boolean;
  onSubmit: (name: string) => void;
  onClose: () => void;
}

export const PlayerNameDialog: React.FC<PlayerNameDialogProps> = ({
  isOpen,
  onSubmit,
  onClose
}) => {
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedName = playerName.trim();
    if (trimmedName.length === 0) {
      setError('Name cannot be empty');
      return;
    }
    
    if (trimmedName.length < 3) {
      setError('Name must be at least 3 characters long');
      return;
    }
    
    if (trimmedName.length > 20) {
      setError('Name must be 20 characters or less');
      return;
    }
    
    if (!/^[a-zA-Z0-9\s]+$/.test(trimmedName)) {
      setError('Name can only contain letters, numbers, and spaces');
      return;
    }

    onSubmit(trimmedName);
    setPlayerName('');
    setError('');
  };

  const handleClose = () => {
    setPlayerName('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="player-name-overlay">
      <div className="player-name-dialog">
        <div className="dialog-header">
          <h2>🎮 Welcome to Wordle Arcade!</h2>
          <p>Enter your name to start tracking your scores</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="playerName">Player Name:</label>
            <input
              id="playerName"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name..."
              maxLength={20}
              autoFocus
              className={error ? 'input-error' : ''}
            />
            {error && <div className="error-message">{error}</div>}
          </div>
          
          <div className="dialog-buttons">
            <button type="submit" className="submit-button">
              🚀 Start Playing
            </button>
            <button type="button" onClick={handleClose} className="cancel-button">
              Skip for now
            </button>
          </div>
        </form>
        
        <div className="dialog-footer">
          <p>Your scores will be saved locally on this device</p>
        </div>
      </div>
    </div>
  );
};

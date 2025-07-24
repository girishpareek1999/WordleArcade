import { useState, useEffect, useCallback } from 'react';
import { GameState, TileState, WordLength, WordConfig } from './types';
import { WordService, WORD_CONFIGS } from './utils/wordService';
import { ScorecardService, PlayerStats } from './utils/scorecardService';
import { PlayerNameDialog } from './components/PlayerNameDialog';
import { Scorecard } from './components/Scorecard';
import ConfigService from './utils/configService';
import './App.css';

const WORD_CONFIG_OPTIONS: Record<WordLength, WordConfig> = {
  5: { length: 5, maxGuesses: 6, label: '5 Letters (6 Guesses)' },
  6: { length: 6, maxGuesses: 6, label: '6 Letters (6 Guesses)' },
  7: { length: 7, maxGuesses: 7, label: '7 Letters (7 Guesses)' }
};

function App() {
  const [selectedWordLength, setSelectedWordLength] = useState<WordLength>(5);
  const [isLoading, setIsLoading] = useState(false);
  const [invalidWordMessage, setInvalidWordMessage] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(120); // Will be set based on word length
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  
  // Scorecard system states
  const [showPlayerNameDialog, setShowPlayerNameDialog] = useState<boolean>(false);
  const [showScorecard, setShowScorecard] = useState<boolean>(false);
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [gameResultRecorded, setGameResultRecorded] = useState<boolean>(false);
  
  // Dynamic timer durations based on word length
  const getTimerDuration = (length: WordLength): number => {
    switch (length) {
      case 5: return 120; // 2 minutes
      case 6: return 180; // 3 minutes  
      case 7: return 300; // 5 minutes
      default: return 180;
    }
  };
  
  // Get half-time for vowel hint
  const getHintTime = (length: WordLength): number => {
    return getTimerDuration(length) / 2;
  };
  
  const [gameState, setGameState] = useState<GameState>(() => {
    const config = WORD_CONFIGS[5]; // Default to 5-letter words
    return {
      guesses: [],
      currentGuess: '',
      gameStatus: 'playing',
      targetWord: WordService.getRandomWord(5),
      currentRow: 0,
      wordLength: 5,
      maxGuesses: config.maxGuesses,
    };
  });

  // Load configuration on component mount
  useEffect(() => {
    const loadConfig = async () => {
      await ConfigService.loadSettings();
      
      // Set default word length from config
      const defaultLength = ConfigService.getDefaultWordLength() as WordLength;
      setSelectedWordLength(defaultLength);
      
      // Check if player exists
      const existingStats = ScorecardService.getPlayerStats();
      if (existingStats) {
        setPlayerStats(existingStats);
      }
      
      // Start a new game with the config default length
      await startNewGame(defaultLength);
      
      console.log('Configuration loaded:', ConfigService.getSettings());
    };
    
    loadConfig();
  }, []);

  // Timer effect - dynamic timing based on word length
  useEffect(() => {
    let interval: number;
    
    if (gameState.gameStatus === 'playing' && timer > 0 && !isTimerPaused) {
      interval = window.setInterval(() => {
        setTimer(prevTimer => {
          const newTimer = prevTimer - 1;
          const hintTime = getHintTime(gameState.wordLength);
          
          // Show vowel hint at half-time
          if (newTimer === hintTime && gameState.gameStatus === 'playing') {
            setShowHint(true);
          }
          
          // End game when timer reaches 0
          if (newTimer === 0 && gameState.gameStatus === 'playing') {
            setGameState(prevState => ({
              ...prevState,
              gameStatus: 'lost'
            }));
            // Record timeout result
            recordGameResult('timeout');
          }
          
          return newTimer;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, [gameState.gameStatus, gameState.wordLength, timer, isTimerPaused]);

  // Generate vowel hint (shows vowels, hides consonants with *)
  const generateVowelHint = (word: string): string => {
    const vowels = 'AEIOU';
    return word
      .split('')
      .map(letter => vowels.includes(letter.toUpperCase()) ? letter : '*')
      .join('');
  };

  const toggleTimer = () => {
    if (gameState.gameStatus === 'playing') {
      setIsTimerPaused(prev => !prev);
    }
  };

  // Player name dialog handlers
  const handlePlayerNameSubmit = (name: string) => {
    const newStats = ScorecardService.initializePlayer(name);
    setPlayerStats(newStats);
    setShowPlayerNameDialog(false);
  };

  const handlePlayerNameClose = () => {
    setShowPlayerNameDialog(false);
  };

  // Scorecard handlers
  const handleShowScorecard = () => {
    if (playerStats) {
      // Refresh stats from storage in case they were updated
      const currentStats = ScorecardService.getPlayerStats();
      if (currentStats) {
        setPlayerStats(currentStats);
      }
      setShowScorecard(true);
    } else {
      setShowPlayerNameDialog(true);
    }
  };

  const handleCloseScorecard = () => {
    setShowScorecard(false);
  };

  // Record game result when game ends
  const recordGameResult = (result: 'won' | 'lost' | 'timeout', attempts?: number) => {
    // Prevent duplicate recording
    if (gameResultRecorded) return;
    
    if (playerStats && gameStartTime > 0) {
      const timeSpent = Math.floor((Date.now() - gameStartTime) / 1000);
      const updatedStats = ScorecardService.recordGameResult(
        gameState.wordLength,
        result,
        gameState.targetWord,
        attempts,
        timeSpent
      );
      
      if (updatedStats) {
        setPlayerStats(updatedStats);
        setGameResultRecorded(true); // Mark as recorded
      }
    }
  };

  const startNewGame = async (wordLength?: WordLength) => {
    setIsLoading(true);
    const length = wordLength || selectedWordLength;
    const config = WORD_CONFIGS[length];
    
    try {
      // Use local JSON words only (no API for word selection)
      const randomWord = WordService.getRandomWord(length);
      
      setGameState({
        guesses: [],
        currentGuess: '',
        gameStatus: 'playing',
        targetWord: randomWord,
        currentRow: 0,
        wordLength: length,
        maxGuesses: config.maxGuesses,
      });
      
      setSelectedWordLength(length);
      // Reset timer and hint for new game with dynamic duration
      setTimer(getTimerDuration(length));
      setShowHint(false);
      setIsTimerPaused(false);
      setInvalidWordMessage(null);
      setGameResultRecorded(false); // Reset result recording flag
      setGameStartTime(Date.now()); // Set game start time
      
    } catch (error) {
      console.error('Error starting new game:', error);
      setInvalidWordMessage('Error starting new game. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getTileStatus = (letter: string, position: number, _guess: string, targetWord: string): TileState['status'] => {
    if (targetWord[position] === letter) {
      return 'correct';
    }
    if (targetWord.includes(letter)) {
      return 'present';
    }
    return 'absent';
  };

  // getKeyStatus function removed - no longer needed without keyboard

  const handleKeyPress = useCallback(async (key: string) => {
    if (gameState.gameStatus !== 'playing' || isLoading) return;

    if (key === 'ENTER') {
      if (gameState.currentGuess.length === gameState.wordLength) {
        // Show loading while validating
        setIsLoading(true);
        
        try {
          // Validate if it's a real word using API or local fallback
          const isValid = await WordService.isValidWord(gameState.currentGuess, gameState.wordLength);
          
          if (!isValid) {
            setInvalidWordMessage('NOT A VALID WORD!');
            setTimeout(() => setInvalidWordMessage(null), 1500);
            setIsLoading(false);
            return;
          }

          const newGuesses = [...gameState.guesses, gameState.currentGuess];
          const isCorrect = gameState.currentGuess === gameState.targetWord;
          const isGameOver = newGuesses.length >= gameState.maxGuesses;

          const newGameStatus = isCorrect ? 'won' : isGameOver ? 'lost' : 'playing';

          setGameState(prev => ({
            ...prev,
            guesses: newGuesses,
            currentGuess: '',
            gameStatus: newGameStatus,
            currentRow: prev.currentRow + 1,
          }));

          // Record game result if game ended
          if (newGameStatus !== 'playing') {
            const result = isCorrect ? 'won' : 'lost';
            recordGameResult(result, newGuesses.length);
          }
        } catch (error) {
          console.error('Word validation error:', error);
          // On error, fall back to synchronous validation
          if (!WordService.isValidWordSync(gameState.currentGuess, gameState.wordLength)) {
            setInvalidWordMessage('NOT A VALID WORD!');
            setTimeout(() => setInvalidWordMessage(null), 1500);
          } else {
            const newGuesses = [...gameState.guesses, gameState.currentGuess];
            const isCorrect = gameState.currentGuess === gameState.targetWord;
            const isGameOver = newGuesses.length >= gameState.maxGuesses;

            const newGameStatus = isCorrect ? 'won' : isGameOver ? 'lost' : 'playing';

            setGameState(prev => ({
              ...prev,
              guesses: newGuesses,
              currentGuess: '',
              gameStatus: newGameStatus,
              currentRow: prev.currentRow + 1,
            }));

            // Record game result if game ended
            if (newGameStatus !== 'playing') {
              const result = isCorrect ? 'won' : 'lost';
              recordGameResult(result, newGuesses.length);
            }
          }
        }
        
        setIsLoading(false);
      }
    } else if (key === 'BACKSPACE') {
      setGameState(prev => ({
        ...prev,
        currentGuess: prev.currentGuess.slice(0, -1),
      }));
    } else if (key.length === 1 && key.match(/[A-Z]/)) {
      if (gameState.currentGuess.length < gameState.wordLength) {
        setGameState(prev => ({
          ...prev,
          currentGuess: prev.currentGuess + key,
        }));
      }
    }
  }, [gameState.gameStatus, gameState.currentGuess, gameState.wordLength, gameState.guesses, gameState.targetWord, gameState.maxGuesses, isLoading, setInvalidWordMessage]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      // Don't capture keyboard events when dialogs are open
      if (showPlayerNameDialog || showScorecard) {
        return;
      }
      
      const key = event.key.toUpperCase();
      if (key === 'ENTER' || key === 'BACKSPACE' || key.match(/[A-Z]/)) {
        event.preventDefault();
        handleKeyPress(key);
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [handleKeyPress, showPlayerNameDialog, showScorecard]);

  const renderGrid = () => {
    const rows = [];
    
    for (let i = 0; i < gameState.maxGuesses; i++) {
      const row = [];
      const guess = i < gameState.guesses.length ? gameState.guesses[i] : 
                    i === gameState.currentRow ? gameState.currentGuess : '';
      
      for (let j = 0; j < gameState.wordLength; j++) {
        const letter = guess[j] || '';
        let status: TileState['status'] = 'empty';
        
        // Apply color status for any completed guess (submitted)
        if (i < gameState.guesses.length && letter) {
          status = getTileStatus(letter, j, guess, gameState.targetWord);
        }
        // For current guess being typed, only show filled state (no colors until submitted)
        else if (i === gameState.currentRow && letter) {
          status = 'empty'; // Keep as empty status but will show 'filled' class
        }
        
        row.push(
          <div
            key={`${i}-${j}`}
            className={`tile ${status} ${letter ? 'filled' : ''}`}
          >
            {letter}
          </div>
        );
      }
      
      rows.push(
        <div 
          key={i} 
          className="row"
          style={{ gridTemplateColumns: `repeat(${gameState.wordLength}, 1fr)` }}
        >
          {row}
        </div>
      );
    }
    
    return rows;
  };

  // Alphabet display removed - no longer showing keyboard

  return (
    <div className="app">
      <header className="header">
        <h1 className="game-title">
          <span className="title-line-1">WORDLE</span>
          <span className="title-line-2">ARCADE</span>
        </h1>
        <div className="controls">
          <select 
            value={selectedWordLength} 
            onChange={(e) => {
              const newLength = Number(e.target.value) as WordLength;
              setSelectedWordLength(newLength);
              startNewGame(newLength);
            }}
            className="word-length-selector"
            disabled={isLoading}
          >
            {Object.entries(WORD_CONFIG_OPTIONS).map(([length, config]) => (
              <option key={length} value={length}>
                {config.label}
              </option>
            ))}
          </select>
          <button 
            className="reset-button" 
            onClick={() => startNewGame()}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'New Game'}
          </button>
          <button 
            className="scorecard-button" 
            onClick={handleShowScorecard}
            disabled={isLoading}
            title="My Scorecard"
          >
            🏆
          </button>
        </div>
      </header>
      
      <div className="game-container">
        {/* Timer/Game Status Display - Always visible */}
        <div className="timer-game-status">
          <div className="timer-display">
            <button 
              className="timer-control-button"
              onClick={toggleTimer}
              title={isTimerPaused ? 'Resume Timer' : 'Pause Timer'}
              disabled={gameState.gameStatus !== 'playing'}
            >
              {isTimerPaused ? '▶️' : '⏸️'}
            </button>
            <span className={`timer-text ${timer <= 30 ? 'timer-critical' : timer <= 60 ? 'timer-warning' : ''} ${isTimerPaused ? 'timer-paused' : ''}`}>
              Time: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
              {isTimerPaused && gameState.gameStatus === 'playing' && ' (Paused)'}
            </span>
          </div>
        </div>
        
        {/* Vowel Hint Display (after 90 seconds) */}
        {showHint && gameState.gameStatus === 'playing' && timer > 0 && (
          <div className="hint-display">
            <div className="hint-label">💡 Hint :</div>
            <div className="hint-word">{generateVowelHint(gameState.targetWord)}</div>
          </div>
        )}
        
        {/* Full Word Reveal (after 180 seconds - time up) */}
        {timer === 0 && gameState.gameStatus === 'lost' && (
          <div className="timeout-display">
            <div className="timeout-label">⏰ Time's Up!</div>
            <div className="timeout-word">The word was: {gameState.targetWord}</div>
          </div>
        )}
        
        {invalidWordMessage && (
          <div className="game-message" style={{background: '#b59f3b', color: '#fff', marginBottom: 10}}>
            {invalidWordMessage}
          </div>
        )}
        
        <div className="grid">
          {renderGrid()}
          
          {/* Overlay messages in the center of the grid */}
          {(gameState.gameStatus === 'won' || gameState.gameStatus === 'lost') && (
            <div className="grid-overlay">
              {gameState.gameStatus === 'won' && (
                <div className="grid-message win-message">
                  <div className="status-icon">🎉</div>
                  <div className="status-text">Congratulations!</div>
                  <div className="status-subtext">You won!</div>
                </div>
              )}
              
              {gameState.gameStatus === 'lost' && timer === 0 && (
                <div className="grid-message timeout-message">
                  <div className="status-icon">⏰</div>
                  <div className="status-text">Time's Up!</div>
                  <div className="status-subtext">Better luck next time!</div>
                </div>
              )}
              
              {gameState.gameStatus === 'lost' && timer > 0 && (
                <div className="grid-message lose-message">
                  <div className="status-icon">😞</div>
                  <div className="status-text">Game Over!</div>
                  <div className="status-subtext">The word was {gameState.targetWord}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Player Name Dialog */}
      <PlayerNameDialog
        isOpen={showPlayerNameDialog}
        onSubmit={handlePlayerNameSubmit}
        onClose={handlePlayerNameClose}
      />

      {/* Scorecard Modal */}
      <Scorecard
        isOpen={showScorecard}
        onClose={handleCloseScorecard}
        playerStats={playerStats}
      />
    </div>
  );
}

export default App;

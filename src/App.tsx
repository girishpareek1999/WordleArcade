import { useState, useEffect, useCallback } from 'react';
import { GameState, TileState, WordLength, WordConfig } from './types';
import { WordService, WORD_CONFIGS } from './utils/wordService';
import ConfigService from './utils/configService';
import './App.css';

const WORD_CONFIG_OPTIONS: Record<WordLength, WordConfig> = {
  5: { length: 5, maxGuesses: 6, label: '5 Letters (6 Guesses)' },
  6: { length: 6, maxGuesses: 6, label: '6 Letters (6 Guesses)' },
  7: { length: 7, maxGuesses: 7, label: '7 Letters (7 Guesses)' }
};

function App() {
  const [selectedWordLength, setSelectedWordLength] = useState<WordLength>(6);
  const [isLoading, setIsLoading] = useState(false);
  const [invalidWordMessage, setInvalidWordMessage] = useState<string | null>(null);
  
  const [gameState, setGameState] = useState<GameState>(() => {
    const config = WORD_CONFIGS[6]; // Default to 6-letter words
    return {
      guesses: [],
      currentGuess: '',
      gameStatus: 'playing',
      targetWord: WordService.getRandomWord(6),
      currentRow: 0,
      wordLength: 6,
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
      
      console.log('Configuration loaded:', ConfigService.getSettings());
    };
    
    loadConfig();
  }, []);

  const startNewGame = async (wordLength?: WordLength) => {
    setIsLoading(true);
    const length = wordLength || selectedWordLength;
    const config = WORD_CONFIGS[length];
    
    try {
      // Try API first, fallback to local words
      const randomWord = await WordService.fetchRandomWordFromAPI(length);
      
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
    } catch (error) {
      console.error('Error starting new game:', error);
      // Fallback to local words
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

  const getKeyStatus = (letter: string): TileState['status'] | undefined => {
    let status: TileState['status'] | undefined;
    
    for (const guess of gameState.guesses) {
      for (let i = 0; i < guess.length; i++) {
        if (guess[i] === letter) {
          const tileStatus = getTileStatus(letter, i, guess, gameState.targetWord);
          if (tileStatus === 'correct') {
            return 'correct';
          }
          if (tileStatus === 'present' && status !== 'correct') {
            status = 'present';
          }
          if (tileStatus === 'absent' && !status) {
            status = 'absent';
          }
        }
      }
    }
    
    return status;
  };

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

          setGameState(prev => ({
            ...prev,
            guesses: newGuesses,
            currentGuess: '',
            gameStatus: isCorrect ? 'won' : isGameOver ? 'lost' : 'playing',
            currentRow: prev.currentRow + 1,
          }));
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

            setGameState(prev => ({
              ...prev,
              guesses: newGuesses,
              currentGuess: '',
              gameStatus: isCorrect ? 'won' : isGameOver ? 'lost' : 'playing',
              currentRow: prev.currentRow + 1,
            }));
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
      const key = event.key.toUpperCase();
      if (key === 'ENTER' || key === 'BACKSPACE' || key.match(/[A-Z]/)) {
        event.preventDefault();
        handleKeyPress(key);
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [handleKeyPress]);

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

  const renderAlphabetDisplay = () => {
    const alphabetRow1 = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
    const alphabetRow2 = ['N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    return (
      <div className="alphabet-display">
        <div className="alphabet-row">
          {alphabetRow1.map(letter => {
            const status = getKeyStatus(letter);
            return (
              <div
                key={letter}
                className={`alphabet-letter ${status || ''}`}
              >
                {letter}
              </div>
            );
          })}
        </div>
        <div className="alphabet-row">
          {alphabetRow2.map(letter => {
            const status = getKeyStatus(letter);
            return (
              <div
                key={letter}
                className={`alphabet-letter ${status || ''}`}
              >
                {letter}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

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
        </div>
      </header>
      
      <div className="game-container">
        {invalidWordMessage && (
          <div className="game-message" style={{background: '#b59f3b', color: '#fff', marginBottom: 10}}>
            {invalidWordMessage}
          </div>
        )}
        
        <div className="grid">
          {renderGrid()}
        </div>
        
        {gameState.gameStatus !== 'playing' && (
          <div className="game-message">
            {gameState.gameStatus === 'won' 
              ? '🎉 Congratulations! You won!' 
              : `😞 Game Over! The word was ${gameState.targetWord}`
            }
          </div>
        )}
        
        {renderAlphabetDisplay()}
      </div>
    </div>
  );
}

export default App;

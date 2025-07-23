export type WordLength = 5 | 6 | 7;

export interface GameState {
  guesses: string[];
  currentGuess: string;
  gameStatus: 'playing' | 'won' | 'lost';
  targetWord: string;
  currentRow: number;
  wordLength: WordLength;
  maxGuesses: number;
}

export interface TileState {
  letter: string;
  status: 'correct' | 'present' | 'absent' | 'empty';
}

export interface KeyboardKeyProps {
  letter: string;
  status?: 'correct' | 'present' | 'absent';
  onClick: (letter: string) => void;
  isSpecial?: boolean;
}

export interface WordConfig {
  length: WordLength;
  maxGuesses: number;
  label: string;
}

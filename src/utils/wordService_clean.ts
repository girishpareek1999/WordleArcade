import { WordLength } from '../types';

// Import JSON word data
import words5Data from '../data/words-5.json';
import words6Data from '../data/words-6.json';
import words7Data from '../data/words-7.json';

// Configuration for word lengths
export const WORD_CONFIGS = {
  5: { length: 5, maxGuesses: 6 },
  6: { length: 6, maxGuesses: 6 },
  7: { length: 7, maxGuesses: 7 }
} as const;

// Extract word arrays from JSON data
const WORDS_5: string[] = words5Data.words;
const WORDS_6: string[] = words6Data.words;
const WORDS_7: string[] = words7Data.words;

// Word lists mapped by length
const WORD_LISTS: Record<WordLength, string[]> = {
  5: WORDS_5,
  6: WORDS_6,
  7: WORDS_7
};

export class WordService {
  // Cache for API validation results to avoid repeated calls
  private static validationCache: Map<string, boolean> = new Map();
  
  // Local words as fallback
  private static wordsByLength: Map<WordLength, string[]> = new Map([
    [5, WORD_LISTS[5]],
    [6, WORD_LISTS[6]], 
    [7, WORD_LISTS[7]]
  ]);

  static getRandomWord(length: WordLength): string {
    const wordList = this.wordsByLength.get(length);
    if (!wordList || wordList.length === 0) {
      throw new Error(`No words found for length ${length}`);
    }
    
    const randomIndex = Math.floor(Math.random() * wordList.length);
    return wordList[randomIndex];
  }

  // Enhanced word validation using multiple APIs
  static async isValidWord(word: string, length: WordLength): Promise<boolean> {
    const upperWord = word.toUpperCase();
    
    // First check: basic word pattern validation
    if (!this.isValidWordPattern(upperWord, length)) {
      return false;
    }

    // Check cache first
    const cacheKey = `${upperWord}-${length}`;
    if (this.validationCache.has(cacheKey)) {
      return this.validationCache.get(cacheKey)!;
    }

    // Second check: verify it exists in our local word list
    const localWordList = this.wordsByLength.get(length);
    if (localWordList && localWordList.includes(upperWord)) {
      this.validationCache.set(cacheKey, true);
      return true;
    }

    // Third check: API validation for words not in our local list
    try {
      const isValid = await this.validateWordWithAPIs(upperWord, length);
      this.validationCache.set(cacheKey, isValid);
      return isValid;
    } catch (error) {
      console.warn('API validation failed, falling back to local validation:', error);
      // Fallback to pattern-based validation
      const fallbackValid = this.isValidWordPattern(upperWord, length);
      this.validationCache.set(cacheKey, fallbackValid);
      return fallbackValid;
    }
  }

  // Synchronous validation (fallback method)
  static isValidWordSync(word: string, length: WordLength): boolean {
    const upperWord = word.toUpperCase();
    
    // Basic pattern validation
    if (!this.isValidWordPattern(upperWord, length)) {
      return false;
    }

    // Check if it exists in our local word lists
    const wordList = this.wordsByLength.get(length);
    return wordList ? wordList.includes(upperWord) : false;
  }

  // Basic word pattern validation
  private static isValidWordPattern(word: string, length: WordLength): boolean {
    // Check length
    if (word.length !== length) {
      return false;
    }

    // Check if it contains only letters
    if (!/^[A-Z]+$/.test(word)) {
      return false;
    }

    // Check for nonsense patterns
    if (this.isNonsensePattern(word)) {
      return false;
    }

    return true;
  }

  // Detect nonsense patterns
  private static isNonsensePattern(word: string): boolean {
    // Check for too many repeated characters
    const charCounts = new Map<string, number>();
    for (const char of word) {
      charCounts.set(char, (charCounts.get(char) || 0) + 1);
    }

    // If any character appears more than half the word length, it's likely nonsense
    const maxRepeats = Math.ceil(word.length / 2);
    for (const count of charCounts.values()) {
      if (count > maxRepeats) {
        return true;
      }
    }

    // Check for too many consecutive identical characters
    let consecutiveCount = 1;
    for (let i = 1; i < word.length; i++) {
      if (word[i] === word[i - 1]) {
        consecutiveCount++;
        if (consecutiveCount > 2) { // More than 2 consecutive identical chars
          return true;
        }
      } else {
        consecutiveCount = 1;
      }
    }

    // Check for too many consonants or vowels in a row
    const vowels = 'AEIOU';
    let consonantStreak = 0;
    let vowelStreak = 0;
    
    for (const char of word) {
      if (vowels.includes(char)) {
        vowelStreak++;
        consonantStreak = 0;
        if (vowelStreak > 3) return true; // Too many vowels in a row
      } else {
        consonantStreak++;
        vowelStreak = 0;
        if (consonantStreak > 4) return true; // Too many consonants in a row
      }
    }

    return false;
  }

  // API validation with multiple sources
  private static async validateWordWithAPIs(word: string, length: WordLength): Promise<boolean> {
    // Try DataMuse API first (more reliable for word validation)
    try {
      const dataMuseValid = await this.validateWithDataMuse(word, length);
      if (dataMuseValid) {
        return true;
      }
    } catch (error) {
      console.warn('DataMuse API failed:', error);
    }

    // Try Dictionary API as backup
    try {
      const dictionaryValid = await this.validateWithDictionaryAPI(word);
      return dictionaryValid;
    } catch (error) {
      console.warn('Dictionary API failed:', error);
      return false;
    }
  }

  // DataMuse API validation
  private static async validateWithDataMuse(word: string, length: WordLength): Promise<boolean> {
    try {
      const response = await fetch(
        `https://api.datamuse.com/words?sp=${word.toLowerCase()}&max=1`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`DataMuse API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Check if the exact word exists and has the correct length
      const exactMatch = data.find((item: any) => 
        item.word && 
        item.word.toUpperCase() === word && 
        item.word.length === length
      );
      
      return !!exactMatch;
    } catch (error) {
      console.error('DataMuse validation error:', error);
      throw error;
    }
  }

  // Dictionary API validation
  private static async validateWithDictionaryAPI(word: string): Promise<boolean> {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );
      
      if (response.status === 404) {
        // Word not found in dictionary
        return false;
      }
      
      if (!response.ok) {
        throw new Error(`Dictionary API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // If we get a valid response with data, the word exists
      return Array.isArray(data) && data.length > 0;
    } catch (error) {
      console.error('Dictionary API validation error:', error);
      throw error;
    }
  }

  // Get a hint word (for debugging/testing)
  static getHintWord(length: WordLength): string {
    const words = this.wordsByLength.get(length);
    if (!words || words.length === 0) {
      return this.getRandomWord(length);
    }
    // Return a word from the middle of the list
    return words[Math.floor(words.length / 2)];
  }

  // Get word count for a specific length
  static getWordCount(length: WordLength): number {
    const words = this.wordsByLength.get(length);
    return words ? words.length : 0;
  }

  // Check if service is properly initialized
  static isInitialized(): boolean {
    return this.wordsByLength.size > 0 && 
           this.wordsByLength.get(5)!.length > 0;
  }
}

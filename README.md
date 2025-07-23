# 6-Letter Wordle Game

A React TypeScript implementation of Wordle using 6-letter words instead of the traditional 5-letter words.

## Features

- **6-letter word guessing**: Play with 6-letter words for an extra challenge
- **7 attempts**: You have 7 chances to guess the correct word
- **Color-coded feedback**:
  - 🟩 Green: Correct letter in correct position
  - 🟨 Yellow: Correct letter in wrong position
  - ⬜ Gray: Letter not in the word
- **Dual input support**: Use physical keyboard or on-screen virtual keyboard
- **Random word selection**: Each game uses a random word from the word list
- **New Game button**: Start fresh anytime
- **Responsive design**: Works on desktop and mobile devices

## How to Play

1. Type a 6-letter word using your keyboard or the on-screen keyboard
2. Press Enter to submit your guess
3. Look at the color feedback to understand which letters are correct
4. Use the feedback to make your next guess
5. Win by guessing the word in 7 attempts or fewer!

## Technologies Used

- **React 18** with **TypeScript**
- **Vite** for fast development and building
- **CSS3** with responsive design
- **JSON** word list with 400+ 6-letter words

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd wordle-6-letter-game
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── App.tsx          # Main game component
├── App.css          # Styling
├── main.tsx         # React app entry point
├── index.css        # Global styles
├── types.ts         # TypeScript interfaces
└── words.json       # 6-letter word dictionary
```

## Game Rules

- Guess the 6-letter word in 7 attempts
- Each guess must be a valid 6-letter word
- After each guess, tiles will change color to show how close you are
- Green means the letter is correct and in the right position
- Yellow means the letter is in the word but in the wrong position
- Gray means the letter is not in the word at all

## Customization

You can easily customize the game by:

- Adding more words to `src/words.json`
- Changing the number of attempts by modifying `MAX_GUESSES` in `App.tsx`
- Adjusting colors and styling in `App.css`
- Modifying word length by changing `WORD_LENGTH` (requires updating word list)

## License

This project is open source and available under the MIT License.

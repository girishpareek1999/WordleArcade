<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a React TypeScript Wordle game project using Vite as the build tool. The game features:

- 6-letter word guessing game
- 7 attempts maximum
- Color-coded feedback (green for correct position, yellow for correct letter wrong position, gray for incorrect)
- Virtual keyboard with color feedback
- Physical keyboard support
- Random word selection from JSON word list
- New game/reset functionality

Key components:
- App.tsx: Main game logic and UI
- types.ts: TypeScript interfaces
- words.json: 6-letter word dictionary
- App.css: Styling with responsive design

The game follows standard Wordle rules but uses 6-letter words instead of 5-letter words.

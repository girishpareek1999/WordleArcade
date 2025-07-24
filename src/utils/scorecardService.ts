import { WordLength } from '../types';

export interface GameResult {
  wordLength: WordLength;
  result: 'won' | 'lost' | 'timeout';
  timestamp: number;
  word?: string;
  attempts?: number;
  timeSpent?: number;
}

export interface PlayerStats {
  playerName: string;
  totalGames: number;
  totalScore: number;
  gamesByLength: {
    [K in WordLength]: {
      played: number;
      won: number;
      lost: number;
      timeout: number;
      score: number;
    };
  };
  gameHistory: GameResult[];
  lastPlayed: number;
}

export interface PlayerTitle {
  title: string;
  description: string;
  minScore: number;
  color: string;
  icon: string;
}

export class ScorecardService {
  private static readonly STORAGE_KEY = 'wordle_arcade_player_stats';
  
  // Clear all data on page load to ensure fresh start every time
  static {
    this.clearOnPageLoad();
  }
  
  // Clear user data on page load
  private static clearOnPageLoad(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
  
  // Scoring system
  private static readonly SCORING = {
    5: { win: 5, lose: 1, timeout: 2 },
    6: { win: 6, lose: 2, timeout: 3 },
    7: { win: 7, lose: 3, timeout: 4 }
  } as const;

  // Player titles based on score
  private static readonly TITLES: PlayerTitle[] = [
    { title: 'Novice', description: 'Word Explorer', minScore: 0, color: '#8B4513', icon: '🌱' },
    { title: 'Apprentice', description: 'Letter Learner', minScore: 25, color: '#4682B4', icon: '📚' },
    { title: 'Wordsmith', description: 'Vocabulary Builder', minScore: 50, color: '#32CD32', icon: '✍️' },
    { title: 'Scholar', description: 'Language Student', minScore: 100, color: '#FF6347', icon: '🎓' },
    { title: 'Expert', description: 'Word Warrior', minScore: 200, color: '#9370DB', icon: '⚔️' },
    { title: 'Master', description: 'Lexicon Legend', minScore: 350, color: '#FFD700', icon: '👑' },
    { title: 'Grandmaster', description: 'Dictionary Deity', minScore: 500, color: '#FF1493', icon: '🏆' },
    { title: 'Champion', description: 'Word Wizard', minScore: 750, color: '#00CED1', icon: '🧙‍♂️' },
    { title: 'Legend', description: 'Alphabet God', minScore: 1000, color: '#FF4500', icon: '🌟' }
  ];

  // Get or create player stats
  static getPlayerStats(playerName?: string): PlayerStats | null {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const stats = JSON.parse(stored) as PlayerStats;
      if (!playerName || stats.playerName === playerName) {
        return stats;
      }
    }
    return null;
  }

  // Initialize new player
  static initializePlayer(playerName: string): PlayerStats {
    const newStats: PlayerStats = {
      playerName: playerName.trim(),
      totalGames: 0,
      totalScore: 0,
      gamesByLength: {
        5: { played: 0, won: 0, lost: 0, timeout: 0, score: 0 },
        6: { played: 0, won: 0, lost: 0, timeout: 0, score: 0 },
        7: { played: 0, won: 0, lost: 0, timeout: 0, score: 0 }
      },
      gameHistory: [],
      lastPlayed: Date.now()
    };
    
    this.savePlayerStats(newStats);
    return newStats;
  }

  // Record a game result
  static recordGameResult(
    wordLength: WordLength, 
    result: 'won' | 'lost' | 'timeout',
    word?: string,
    attempts?: number,
    timeSpent?: number
  ): PlayerStats | null {
    const stats = this.getPlayerStats();
    if (!stats) return null;

    const gameResult: GameResult = {
      wordLength,
      result,
      timestamp: Date.now(),
      word,
      attempts,
      timeSpent
    };

    // Calculate score for this game
    const scoring = this.SCORING[wordLength];
    const gameScore = result === 'won' ? scoring.win : 
                     result === 'lost' ? scoring.lose : 
                     scoring.timeout;
    
    // Update stats
    stats.totalGames++;
    stats.totalScore += gameScore;
    stats.gamesByLength[wordLength].played++;
    
    // Update result-specific counters
    if (result === 'won') {
      stats.gamesByLength[wordLength].won++;
    } else if (result === 'lost') {
      stats.gamesByLength[wordLength].lost++;
    } else if (result === 'timeout') {
      stats.gamesByLength[wordLength].timeout++;
    }
    
    stats.gamesByLength[wordLength].score += gameScore;
    stats.gameHistory.push(gameResult);
    stats.lastPlayed = Date.now();

    // Keep only last 100 games in history
    if (stats.gameHistory.length > 100) {
      stats.gameHistory = stats.gameHistory.slice(-100);
    }

    this.savePlayerStats(stats);
    return stats;
  }

  // Save stats to localStorage
  private static savePlayerStats(stats: PlayerStats): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stats));
  }

  // Get player title based on score
  static getPlayerTitle(score: number): PlayerTitle {
    const titles = [...this.TITLES].reverse(); // Start from highest
    return titles.find(title => score >= title.minScore) || this.TITLES[0];
  }

  // Get detailed statistics
  static getDetailedStats(stats: PlayerStats) {
    const winRate = stats.totalGames > 0 ? 
      ((stats.gamesByLength[5].won + stats.gamesByLength[6].won + stats.gamesByLength[7].won) / stats.totalGames * 100).toFixed(1) : '0';
    
    const averageScore = stats.totalGames > 0 ? 
      (stats.totalScore / stats.totalGames).toFixed(1) : '0';

    const favoriteLength = Object.entries(stats.gamesByLength)
      .reduce((max, [length, data]) => 
        data.played > max.played ? { length: parseInt(length) as WordLength, played: data.played } : max, 
        { length: 5 as WordLength, played: 0 }
      );

    const recentStreak = this.calculateWinStreak(stats.gameHistory);

    return {
      winRate,
      averageScore,
      favoriteLength: favoriteLength.length,
      currentStreak: recentStreak,
      bestCategory: this.getBestCategory(stats),
      timesPlayed: stats.totalGames,
      lastPlayed: new Date(stats.lastPlayed).toLocaleDateString()
    };
  }

  // Calculate current win streak
  private static calculateWinStreak(history: GameResult[]): number {
    let streak = 0;
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].result === 'won') {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  // Get best performing category
  private static getBestCategory(stats: PlayerStats): { length: WordLength; percentage: number } {
    let bestLength: WordLength = 5;
    let bestPercentage = 0;

    Object.entries(stats.gamesByLength).forEach(([length, data]) => {
      if (data.played > 0) {
        const winPercentage = (data.won / data.played) * 100;
        if (winPercentage > bestPercentage) {
          bestPercentage = winPercentage;
          bestLength = parseInt(length) as WordLength;
        }
      }
    });

    return { length: bestLength, percentage: Math.round(bestPercentage) };
  }

  // Generate scorecard data for rendering
  static generateScorecardData(stats: PlayerStats) {
    const title = this.getPlayerTitle(stats.totalScore);
    const detailedStats = this.getDetailedStats(stats);
    
    return {
      playerName: stats.playerName,
      title,
      totalScore: stats.totalScore,
      totalGames: stats.totalGames,
      detailedStats,
      gamesByLength: stats.gamesByLength,
      createdAt: new Date().toLocaleDateString()
    };
  }

  // Export stats for backup
  static exportStats(): string {
    const stats = this.getPlayerStats();
    return stats ? JSON.stringify(stats, null, 2) : '';
  }

  // Import stats from backup
  static importStats(data: string): boolean {
    try {
      const stats = JSON.parse(data) as PlayerStats;
      this.savePlayerStats(stats);
      return true;
    } catch {
      return false;
    }
  }

  // Reset all stats (with confirmation)
  static resetStats(): boolean {
    localStorage.removeItem(this.STORAGE_KEY);
    return true;
  }

  // Check if player exists
  static hasPlayerData(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  }
}

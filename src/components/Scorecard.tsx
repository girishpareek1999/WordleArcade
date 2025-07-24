import React from 'react';
import { ScorecardService, PlayerStats } from '../utils/scorecardService';
import './Scorecard.css';

interface ScorecardProps {
  isOpen: boolean;
  onClose: () => void;
  playerStats: PlayerStats | null;
}

export const Scorecard: React.FC<ScorecardProps> = ({
  isOpen,
  onClose,
  playerStats
}) => {
  if (!isOpen || !playerStats) return null;

  const scorecardData = ScorecardService.generateScorecardData(playerStats);
  const { title, detailedStats } = scorecardData;

  return (
    <div className="scorecard-overlay">
      <div className="scorecard-container">
        <div className="scorecard">
          {/* Header */}
          <div className="scorecard-header">
            <div className="title-section">
              <h1 className="game-title-card">WORDLE ARCADE</h1>
              <div className="player-title">
                <span className="title-icon">{title.icon}</span>
                <span className="title-text">{title.title}</span>
              </div>
              <div className="player-name">{playerStats.playerName}</div>
            </div>
            <div className="score-section">
              <div className="total-score" style={{ color: title.color }}>
                {scorecardData.totalScore}
              </div>
              <div className="score-label">Total Score</div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🎮</div>
              <div className="stat-value">{scorecardData.totalGames}</div>
              <div className="stat-label">Games Played</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-value">{detailedStats.winRate}%</div>
              <div className="stat-label">Win Rate</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-value">{detailedStats.averageScore}</div>
              <div className="stat-label">Avg Score</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-value">{detailedStats.currentStreak}</div>
              <div className="stat-label">Win Streak</div>
            </div>
          </div>

          {/* Game Type Breakdown */}
          <div className="game-breakdown">
            <h3>Performance by Game Type</h3>
            {Object.entries(scorecardData.gamesByLength).map(([length, stats]) => (
              <div key={length} className="game-type-row">
                <div className="game-type-info">
                  <span className="game-length">{length} Letters</span>
                  <span className="games-count">{stats.played} games</span>
                </div>
                <div className="game-type-stats">
                  <div className="wins">
                    <span className="stat-icon-small">✅</span>
                    <span>{stats.won}W</span>
                  </div>
                  <div className="losses">
                    <span className="stat-icon-small">❌</span>
                    <span>{stats.lost}L</span>
                  </div>
                  <div className="timeouts">
                    <span className="stat-icon-small">⏰</span>
                    <span>{stats.timeout}T</span>
                  </div>
                  <div className="score">
                    <span className="stat-icon-small">⭐</span>
                    <span>{stats.score}pts</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="scorecard-footer">
            <div className="generated-date">Generated on {scorecardData.createdAt}</div>
            <div className="game-description">
              <span className="title-description">{title.description}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="scorecard-actions">
          <div className="coming-soon">
            📥 Download as PNG - Coming Soon!
          </div>
          <button onClick={onClose} className="scorecard-close-btn">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

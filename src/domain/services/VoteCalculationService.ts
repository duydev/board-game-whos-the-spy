import type { GameState } from '../entities/GameState';

export interface VoteResult {
  playerId: string;
  playerName: string;
  voteCount: number;
}

export class VoteCalculationService {
  /**
   * Calculates vote results from game state
   * @param gameState Current game state
   * @returns Array of vote results sorted by vote count (descending)
   */
  static getVoteResults(gameState: GameState): VoteResult[] {
    const voteCounts: Record<string, number> = {};

    Object.values(gameState.votes).forEach((votedPlayerId) => {
      voteCounts[votedPlayerId] = (voteCounts[votedPlayerId] || 0) + 1;
    });

    return gameState.players
      .filter((p) => !p.isEliminated)
      .map((player) => ({
        playerId: player.id,
        playerName: player.name,
        voteCount: voteCounts[player.id] || 0,
      }))
      .sort((a, b) => b.voteCount - a.voteCount);
  }

  /**
   * Gets the player ID with the most votes
   * In case of a tie, randomly selects one
   * @param gameState Current game state
   * @returns Player ID with most votes, or null if no votes
   */
  static getPlayerWithMostVotes(gameState: GameState): string | null {
    const results = this.getVoteResults(gameState);
    if (results.length === 0) return null;

    const maxVotes = results[0].voteCount;
    if (maxVotes === 0) return null; // No votes cast

    // Check for ties
    const topVoted = results.filter((r) => r.voteCount === maxVotes);
    if (topVoted.length > 1) {
      // Tie - randomly select one
      const randomIndex = Math.floor(Math.random() * topVoted.length);
      return topVoted[randomIndex].playerId;
    }

    return results[0].playerId;
  }
}

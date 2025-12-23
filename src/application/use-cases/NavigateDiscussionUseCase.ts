import type { GameState } from '@/domain';
import { GameState as GameStateHelper } from '@/domain/entities/GameState';

export class NavigateDiscussionUseCase {
  /**
   * Move to next discussion player
   */
  nextPlayer(gameState: GameState): GameState {
    const activePlayers = GameStateHelper.getActivePlayers(gameState);
    const nextIndex = (gameState.currentDiscussionPlayerIndex + 1) % activePlayers.length;

    return {
      ...gameState,
      currentDiscussionPlayerIndex: nextIndex,
    };
  }

  /**
   * Reset discussion to first player
   */
  reset(gameState: GameState): GameState {
    return {
      ...gameState,
      currentDiscussionPlayerIndex: 0,
      currentVotingPlayerIndex: 0,
      votes: {},
      discussionTimeRemaining: 120,
    };
  }

  /**
   * Update discussion time remaining
   */
  updateTime(gameState: GameState, timeRemaining: number): GameState {
    return {
      ...gameState,
      discussionTimeRemaining: Math.max(0, timeRemaining),
    };
  }
}

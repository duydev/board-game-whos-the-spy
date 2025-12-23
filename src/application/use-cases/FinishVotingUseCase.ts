import type { GameState } from '@/domain';
import { VoteCalculationService } from '@/domain/services/VoteCalculationService';
import { EliminatePlayerUseCase } from './EliminatePlayerUseCase';

export interface FinishVotingResult {
  gameState: GameState;
  eliminatedPlayerId: string | null;
}

export class FinishVotingUseCase {
  private eliminatePlayerUseCase: EliminatePlayerUseCase;

  constructor() {
    this.eliminatePlayerUseCase = new EliminatePlayerUseCase();
  }

  execute(gameState: GameState): FinishVotingResult {
    const eliminatedPlayerId = VoteCalculationService.getPlayerWithMostVotes(gameState);

    if (!eliminatedPlayerId) {
      // No votes or no clear winner, return unchanged state
      return {
        gameState,
        eliminatedPlayerId: null,
      };
    }

    // Eliminate the player with most votes
    const result = this.eliminatePlayerUseCase.execute(gameState, eliminatedPlayerId);

    // Prepare for next round if game is not over
    const nextRoundState: GameState = result.gameState.isGameOver
      ? result.gameState
      : {
          ...result.gameState,
          currentRound: result.gameState.currentRound + 1,
          currentDiscussionPlayerIndex: 0,
          currentVotingPlayerIndex: 0,
          votes: {},
          discussionTimeRemaining: 120,
        };

    return {
      gameState: nextRoundState,
      eliminatedPlayerId: result.eliminatedPlayerId,
    };
  }
}

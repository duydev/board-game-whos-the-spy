import type { GameState } from '@/domain';

export interface SubmitVoteResult {
  gameState: GameState;
  success: boolean;
  error?: string;
}

export class SubmitVoteUseCase {
  execute(gameState: GameState, voterId: string, votedPlayerId: string): SubmitVoteResult {
    // Validation
    if (!gameState) {
      return { gameState, success: false, error: 'Game state is required' };
    }

    const voter = gameState.players.find((p) => p.id === voterId);
    const votedPlayer = gameState.players.find((p) => p.id === votedPlayerId);

    if (!voter) {
      return { gameState, success: false, error: 'Voter not found' };
    }

    if (!votedPlayer) {
      return { gameState, success: false, error: 'Voted player not found' };
    }

    if (voter.isEliminated) {
      return { gameState, success: false, error: 'Eliminated players cannot vote' };
    }

    if (votedPlayer.isEliminated) {
      return { gameState, success: false, error: 'Cannot vote for eliminated player' };
    }

    if (voterId === votedPlayerId) {
      return { gameState, success: false, error: 'Cannot vote for yourself' };
    }

    // Update game state
    const updatedGameState: GameState = {
      ...gameState,
      votes: {
        ...gameState.votes,
        [voterId]: votedPlayerId,
      },
    };

    return { gameState: updatedGameState, success: true };
  }
}

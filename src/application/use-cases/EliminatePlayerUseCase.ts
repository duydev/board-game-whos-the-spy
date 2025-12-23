import type { GameState } from '@/domain';
import { WinConditionService } from '@/domain/services/WinConditionService';

export interface EliminatePlayerResult {
  gameState: GameState;
  eliminatedPlayerId: string | null;
}

export class EliminatePlayerUseCase {
  execute(gameState: GameState, playerId: string): EliminatePlayerResult {
    const updatedPlayers = gameState.players.map((player) =>
      player.id === playerId ? { ...player, isEliminated: true } : player
    );

    const winner = WinConditionService.checkWinCondition(updatedPlayers);

    const updatedGameState: GameState = {
      ...gameState,
      players: updatedPlayers,
      winner,
      isGameOver: winner !== null,
      votes: {}, // Reset votes for next round
    };

    return {
      gameState: updatedGameState,
      eliminatedPlayerId: playerId,
    };
  }
}

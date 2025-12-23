import type { Player } from '../entities/Player';
import type { Winner } from '../entities/GameState';

export class WinConditionService {
  /**
   * Checks the win condition based on active players
   * @param players Array of all players
   * @returns Winner: 'civilians', 'spies', or null if game continues
   */
  static checkWinCondition(players: Player[]): Winner {
    const activePlayers = players.filter((p) => !p.isEliminated);
    const activeSpies = activePlayers.filter((p) => p.role === 'spy');
    const activeCivilians = activePlayers.filter((p) => p.role === 'civilian');

    // Civilians win if all spies are eliminated
    if (activeSpies.length === 0) {
      return 'civilians';
    }

    // Spies win if number of spies equals or exceeds number of civilians
    if (activeSpies.length >= activeCivilians.length) {
      return 'spies';
    }

    return null;
  }
}

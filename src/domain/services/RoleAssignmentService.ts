import type { Player } from '../entities/Player';
import type { WordPair } from '../value-objects/WordPair';
import { generatePlayerId } from '../utils/idGenerator';

export class RoleAssignmentService {
  /**
   * Assigns roles to players based on names and spy count
   * @param playerNames Array of player names
   * @param numberOfSpies Number of spies to assign
   * @param wordPair The word pair for civilians
   * @returns Array of players with assigned roles and words
   */
  static assignRoles(playerNames: string[], numberOfSpies: number, wordPair: WordPair): Player[] {
    const players: Player[] = playerNames.map((name) => ({
      id: generatePlayerId(),
      name,
      role: 'civilian',
      isEliminated: false,
    }));

    // Randomly assign spy roles
    const spyIndices: number[] = [];
    while (spyIndices.length < numberOfSpies) {
      const randomIndex = Math.floor(Math.random() * players.length);
      if (!spyIndices.includes(randomIndex)) {
        spyIndices.push(randomIndex);
      }
    }

    // Assign words to players
    const [word1, word2] = wordPair;
    let word1Count = 0;
    let word2Count = 0;

    players.forEach((player, index) => {
      if (spyIndices.includes(index)) {
        // Spy doesn't get a word
        player.role = 'spy';
      } else {
        // Assign words to civilians, distribute evenly
        if (word1Count <= word2Count) {
          player.word = word1;
          word1Count++;
        } else {
          player.word = word2;
          word2Count++;
        }
      }
    });

    return players;
  }
}

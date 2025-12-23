import type { GameState } from '../entities/GameState';
import type { GameConfig } from '../entities/GameConfig';
import type { ICategoryRepository } from '../repositories/ICategoryRepository';
import { RoleAssignmentService } from './RoleAssignmentService';

export class GameInitializationService {
  /**
   * Initializes a new game state
   * @param config Game configuration
   * @param playerNames Array of player names
   * @param categoryRepository Repository for category/word pair selection
   * @returns New game state
   */
  static async initializeGame(
    config: GameConfig,
    playerNames: string[],
    categoryRepository: ICategoryRepository
  ): Promise<GameState> {
    const wordPair = await categoryRepository.selectRandomWordPair(config.category);
    const players = RoleAssignmentService.assignRoles(playerNames, config.numberOfSpies, wordPair);

    return {
      config,
      players,
      currentRound: 1,
      currentDiscussionPlayerIndex: 0,
      currentVotingPlayerIndex: 0,
      votes: {},
      wordPair,
      winner: null,
      isGameOver: false,
      discussionTimeRemaining: 120, // 2 minutes
    };
  }
}

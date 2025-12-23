import type { GameState, GameConfig } from '@/domain';
import type { ICategoryRepository } from '@/domain/repositories/ICategoryRepository';
import { GameInitializationService } from '@/domain/services/GameInitializationService';

export class StartGameUseCase {
  private categoryRepository: ICategoryRepository;

  constructor(categoryRepository: ICategoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute(config: GameConfig, playerNames: string[]): Promise<GameState> {
    if (playerNames.length !== config.totalPlayers) {
      throw new Error(`Expected ${config.totalPlayers} players, but got ${playerNames.length}`);
    }

    if (playerNames.length < 3) {
      throw new Error('Game requires at least 3 players');
    }

    return GameInitializationService.initializeGame(config, playerNames, this.categoryRepository);
  }
}

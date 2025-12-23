import type { GameState, GameConfig } from '@/domain';
import type { ICategoryRepository } from '@/domain/repositories/ICategoryRepository';
import type { IGameStorageRepository } from '@/domain/repositories/IGameStorageRepository';
import { StartGameUseCase } from './use-cases/StartGameUseCase';
import { SubmitVoteUseCase } from './use-cases/SubmitVoteUseCase';
import { FinishVotingUseCase } from './use-cases/FinishVotingUseCase';
import { NavigateDiscussionUseCase } from './use-cases/NavigateDiscussionUseCase';
import { VoteCalculationService } from '@/domain/services/VoteCalculationService';

export class GameService {
  private startGameUseCase: StartGameUseCase;
  private submitVoteUseCase: SubmitVoteUseCase;
  private finishVotingUseCase: FinishVotingUseCase;
  private navigateDiscussionUseCase: NavigateDiscussionUseCase;
  private storageRepository: IGameStorageRepository;

  constructor(categoryRepository: ICategoryRepository, storageRepository: IGameStorageRepository) {
    this.startGameUseCase = new StartGameUseCase(categoryRepository);
    this.submitVoteUseCase = new SubmitVoteUseCase();
    this.finishVotingUseCase = new FinishVotingUseCase();
    this.navigateDiscussionUseCase = new NavigateDiscussionUseCase();
    this.storageRepository = storageRepository;
  }

  /**
   * Start a new game
   */
  async startGame(config: GameConfig, playerNames: string[]): Promise<GameState> {
    const gameState = await this.startGameUseCase.execute(config, playerNames);
    await this.storageRepository.saveGameState(gameState);
    return gameState;
  }

  /**
   * Submit a vote
   */
  async submitVote(
    gameState: GameState,
    voterId: string,
    votedPlayerId: string
  ): Promise<GameState> {
    const result = this.submitVoteUseCase.execute(gameState, voterId, votedPlayerId);
    if (!result.success) {
      throw new Error(result.error || 'Failed to submit vote');
    }
    await this.storageRepository.saveGameState(result.gameState);
    return result.gameState;
  }

  /**
   * Finish voting round and eliminate player
   */
  async finishVoting(gameState: GameState): Promise<GameState> {
    const result = this.finishVotingUseCase.execute(gameState);
    await this.storageRepository.saveGameState(result.gameState);
    return result.gameState;
  }

  /**
   * Move to next discussion player
   */
  async nextDiscussionPlayer(gameState: GameState): Promise<GameState> {
    const updatedState = this.navigateDiscussionUseCase.nextPlayer(gameState);
    await this.storageRepository.saveGameState(updatedState);
    return updatedState;
  }

  /**
   * Reset discussion
   */
  async resetDiscussion(gameState: GameState): Promise<GameState> {
    const updatedState = this.navigateDiscussionUseCase.reset(gameState);
    await this.storageRepository.saveGameState(updatedState);
    return updatedState;
  }

  /**
   * Update discussion time
   */
  async updateDiscussionTime(gameState: GameState, timeRemaining: number): Promise<GameState> {
    const updatedState = this.navigateDiscussionUseCase.updateTime(gameState, timeRemaining);
    await this.storageRepository.saveGameState(updatedState);
    return updatedState;
  }

  /**
   * Load game state from storage
   */
  async loadGameState(): Promise<GameState | null> {
    return this.storageRepository.loadGameState();
  }

  /**
   * Clear game state from storage
   */
  async clearGameState(): Promise<void> {
    return this.storageRepository.clearGameState();
  }

  /**
   * Get vote results (read-only operation)
   */
  getVoteResults(gameState: GameState) {
    return VoteCalculationService.getVoteResults(gameState);
  }

  /**
   * Get player with most votes (read-only operation)
   */
  getPlayerWithMostVotes(gameState: GameState): string | null {
    return VoteCalculationService.getPlayerWithMostVotes(gameState);
  }
}

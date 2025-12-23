import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameInitializationService } from './GameInitializationService';
import type { GameConfig } from '../entities/GameConfig';
import type { ICategoryRepository } from '../repositories/ICategoryRepository';
import type { WordPair } from '../value-objects/WordPair';

describe('GameInitializationService', () => {
  let mockCategoryRepository: ICategoryRepository;

  beforeEach(() => {
    mockCategoryRepository = {
      getAvailableCategories: vi.fn().mockResolvedValue(['Động vật', 'Đồ ăn']),
      selectRandomWordPair: vi.fn().mockResolvedValue(['Chó', 'Mèo'] as WordPair),
      getCategoryDisplayName: vi.fn((category: string) => category),
    };
  });

  describe('initializeGame', () => {
    it('should initialize game with valid config and player names', async () => {
      const config: GameConfig = {
        totalPlayers: 5,
        numberOfSpies: 1,
        category: 'Động vật',
      };
      const playerNames = ['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5'];

      const gameState = await GameInitializationService.initializeGame(
        config,
        playerNames,
        mockCategoryRepository
      );

      expect(gameState.config).toEqual(config);
      expect(gameState.players).toHaveLength(5);
      expect(gameState.players.every((p) => playerNames.includes(p.name))).toBe(true);
      expect(gameState.currentRound).toBe(1);
      expect(gameState.currentDiscussionPlayerIndex).toBe(0);
      expect(gameState.currentVotingPlayerIndex).toBe(0);
      expect(gameState.votes).toEqual({});
      expect(gameState.wordPair).toEqual(['Chó', 'Mèo']);
      expect(gameState.winner).toBe(null);
      expect(gameState.isGameOver).toBe(false);
      expect(gameState.discussionTimeRemaining).toBe(120);
    });

    it('should assign correct number of spies', async () => {
      const config: GameConfig = {
        totalPlayers: 5,
        numberOfSpies: 2,
        category: 'Động vật',
      };
      const playerNames = ['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5'];

      const gameState = await GameInitializationService.initializeGame(
        config,
        playerNames,
        mockCategoryRepository
      );

      const spies = gameState.players.filter((p) => p.role === 'spy');
      expect(spies).toHaveLength(2);
      expect(spies.every((p) => !p.word)).toBe(true);
    });

    it('should assign words to civilians only', async () => {
      const config: GameConfig = {
        totalPlayers: 5,
        numberOfSpies: 1,
        category: 'Động vật',
      };
      const playerNames = ['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5'];

      const gameState = await GameInitializationService.initializeGame(
        config,
        playerNames,
        mockCategoryRepository
      );

      const civilians = gameState.players.filter((p) => p.role === 'civilian');
      expect(civilians).toHaveLength(4);
      expect(civilians.every((p) => p.word !== undefined)).toBe(true);
      expect(civilians.every((p) => p.word === 'Chó' || p.word === 'Mèo')).toBe(true);
    });

    it('should distribute words evenly between word1 and word2', async () => {
      const config: GameConfig = {
        totalPlayers: 5,
        numberOfSpies: 1,
        category: 'Động vật',
      };
      const playerNames = ['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5'];

      const gameState = await GameInitializationService.initializeGame(
        config,
        playerNames,
        mockCategoryRepository
      );

      const civilians = gameState.players.filter((p) => p.role === 'civilian');
      const word1Count = civilians.filter((p) => p.word === 'Chó').length;
      const word2Count = civilians.filter((p) => p.word === 'Mèo').length;

      // With 4 civilians, should be 2-2 distribution
      expect(word1Count).toBe(2);
      expect(word2Count).toBe(2);
    });

    it('should handle odd number of civilians with balanced distribution', async () => {
      const config: GameConfig = {
        totalPlayers: 6,
        numberOfSpies: 1,
        category: 'Động vật',
      };
      const playerNames = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];

      const gameState = await GameInitializationService.initializeGame(
        config,
        playerNames,
        mockCategoryRepository
      );

      const civilians = gameState.players.filter((p) => p.role === 'civilian');
      const word1Count = civilians.filter((p) => p.word === 'Chó').length;
      const word2Count = civilians.filter((p) => p.word === 'Mèo').length;

      // With 5 civilians, should be 3-2 or 2-3 distribution
      expect(Math.abs(word1Count - word2Count)).toBeLessThanOrEqual(1);
      expect(word1Count + word2Count).toBe(5);
    });

    it('should call selectRandomWordPair with correct category', async () => {
      const config: GameConfig = {
        totalPlayers: 3,
        numberOfSpies: 1,
        category: 'Đồ ăn',
      };
      const playerNames = ['P1', 'P2', 'P3'];

      await GameInitializationService.initializeGame(config, playerNames, mockCategoryRepository);

      expect(mockCategoryRepository.selectRandomWordPair).toHaveBeenCalledWith('Đồ ăn');
    });

    it('should call selectRandomWordPair with random when category is random', async () => {
      const config: GameConfig = {
        totalPlayers: 3,
        numberOfSpies: 1,
        category: 'random',
      };
      const playerNames = ['P1', 'P2', 'P3'];

      await GameInitializationService.initializeGame(config, playerNames, mockCategoryRepository);

      expect(mockCategoryRepository.selectRandomWordPair).toHaveBeenCalledWith('random');
    });

    it('should set all players as not eliminated initially', async () => {
      const config: GameConfig = {
        totalPlayers: 4,
        numberOfSpies: 1,
        category: 'Động vật',
      };
      const playerNames = ['P1', 'P2', 'P3', 'P4'];

      const gameState = await GameInitializationService.initializeGame(
        config,
        playerNames,
        mockCategoryRepository
      );

      expect(gameState.players.every((p) => !p.isEliminated)).toBe(true);
    });
  });
});

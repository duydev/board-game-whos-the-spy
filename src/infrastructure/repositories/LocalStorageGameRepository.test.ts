import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageGameRepository } from './LocalStorageGameRepository';
import type { GameState } from '@/domain/entities/GameState';
import type { GameConfig } from '@/domain/entities/GameConfig';

describe('LocalStorageGameRepository', () => {
  let repository: LocalStorageGameRepository;

  beforeEach(() => {
    repository = new LocalStorageGameRepository();
    localStorage.clear();
  });

  const createMockGameState = (): GameState => ({
    config: {
      totalPlayers: 5,
      numberOfSpies: 1,
      category: 'Động vật',
    } as GameConfig,
    players: [
      { id: '1', name: 'Player 1', role: 'civilian', word: 'Chó', isEliminated: false },
      { id: '2', name: 'Player 2', role: 'civilian', word: 'Mèo', isEliminated: false },
      { id: '3', name: 'Player 3', role: 'civilian', word: 'Chó', isEliminated: false },
      { id: '4', name: 'Player 4', role: 'spy', isEliminated: false },
      { id: '5', name: 'Player 5', role: 'civilian', word: 'Mèo', isEliminated: false },
    ],
    currentRound: 1,
    currentDiscussionPlayerIndex: 0,
    currentVotingPlayerIndex: 0,
    votes: {},
    wordPair: ['Chó', 'Mèo'],
    winner: null,
    isGameOver: false,
    discussionTimeRemaining: 120,
  });

  describe('saveGameState', () => {
    it('should save game state to localStorage', async () => {
      const gameState = createMockGameState();

      await repository.saveGameState(gameState);

      const saved = localStorage.getItem('whos-the-spy-game-state');
      expect(saved).toBeTruthy();
      const parsed = JSON.parse(saved!);
      expect(parsed.config.totalPlayers).toBe(5);
      expect(parsed.players).toHaveLength(5);
    });

    it('should overwrite existing game state', async () => {
      const gameState1 = createMockGameState();
      await repository.saveGameState(gameState1);

      const gameState2 = createMockGameState();
      gameState2.currentRound = 2;
      await repository.saveGameState(gameState2);

      const loaded = await repository.loadGameState();
      expect(loaded?.currentRound).toBe(2);
    });

    it('should save complete game state including all properties', async () => {
      const gameState = createMockGameState();
      gameState.votes = { '1': '4', '2': '4' };
      gameState.currentRound = 2;
      gameState.winner = 'civilians';
      gameState.isGameOver = true;

      await repository.saveGameState(gameState);
      const loaded = await repository.loadGameState();

      expect(loaded?.votes).toEqual({ '1': '4', '2': '4' });
      expect(loaded?.currentRound).toBe(2);
      expect(loaded?.winner).toBe('civilians');
      expect(loaded?.isGameOver).toBe(true);
    });
  });

  describe('loadGameState', () => {
    it('should return null when no game state exists', async () => {
      const result = await repository.loadGameState();

      expect(result).toBe(null);
    });

    it('should load saved game state', async () => {
      const gameState = createMockGameState();
      await repository.saveGameState(gameState);

      const loaded = await repository.loadGameState();

      expect(loaded).toBeTruthy();
      expect(loaded?.config.totalPlayers).toBe(5);
      expect(loaded?.players).toHaveLength(5);
      expect(loaded?.wordPair).toEqual(['Chó', 'Mèo']);
    });

    it('should return exact game state that was saved', async () => {
      const gameState = createMockGameState();
      gameState.players[0].isEliminated = true;
      gameState.votes = { '2': '4', '3': '4' };
      gameState.currentRound = 3;

      await repository.saveGameState(gameState);
      const loaded = await repository.loadGameState();

      expect(loaded?.players[0].isEliminated).toBe(true);
      expect(loaded?.votes).toEqual({ '2': '4', '3': '4' });
      expect(loaded?.currentRound).toBe(3);
    });

    it('should handle corrupted localStorage data gracefully', async () => {
      localStorage.setItem('whos-the-spy-game-state', 'invalid json');

      const result = await repository.loadGameState();

      expect(result).toBe(null);
    });
  });

  describe('clearGameState', () => {
    it('should remove game state from localStorage', async () => {
      const gameState = createMockGameState();
      await repository.saveGameState(gameState);

      await repository.clearGameState();

      const saved = localStorage.getItem('whos-the-spy-game-state');
      expect(saved).toBe(null);
    });

    it('should not throw error when clearing non-existent game state', async () => {
      await expect(repository.clearGameState()).resolves.not.toThrow();
    });

    it('should clear game state and loadGameState should return null', async () => {
      const gameState = createMockGameState();
      await repository.saveGameState(gameState);

      await repository.clearGameState();
      const loaded = await repository.loadGameState();

      expect(loaded).toBe(null);
    });
  });

  describe('integration', () => {
    it('should save, load, and clear game state correctly', async () => {
      const gameState = createMockGameState();

      // Save
      await repository.saveGameState(gameState);
      let loaded = await repository.loadGameState();
      expect(loaded).toBeTruthy();

      // Clear
      await repository.clearGameState();
      loaded = await repository.loadGameState();
      expect(loaded).toBe(null);

      // Save again
      await repository.saveGameState(gameState);
      loaded = await repository.loadGameState();
      expect(loaded).toBeTruthy();
    });
  });
});

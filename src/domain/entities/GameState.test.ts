import { describe, it, expect } from 'vitest';
import { GameState } from './GameState';
import type { GameState as GameStateType } from './GameState';
import type { Player } from './Player';
import type { GameConfig } from './GameConfig';

describe('GameState', () => {
  const createMockConfig = (): GameConfig => ({
    totalPlayers: 5,
    numberOfSpies: 1,
    category: 'Động vật',
  });

  const createMockPlayers = (): Player[] => [
    { id: '1', name: 'Player 1', role: 'civilian', word: 'Chó', isEliminated: false },
    { id: '2', name: 'Player 2', role: 'civilian', word: 'Mèo', isEliminated: false },
    { id: '3', name: 'Player 3', role: 'civilian', word: 'Chó', isEliminated: false },
    { id: '4', name: 'Player 4', role: 'spy', isEliminated: false },
    { id: '5', name: 'Player 5', role: 'civilian', word: 'Mèo', isEliminated: false },
  ];

  const createMockGameState = (): GameStateType => ({
    config: createMockConfig(),
    players: createMockPlayers(),
    currentRound: 1,
    currentDiscussionPlayerIndex: 0,
    currentVotingPlayerIndex: 0,
    votes: {},
    wordPair: ['Chó', 'Mèo'],
    winner: null,
    isGameOver: false,
    discussionTimeRemaining: 120,
  });

  describe('getActivePlayers', () => {
    it('should return all players when none are eliminated', () => {
      const state = createMockGameState();
      const activePlayers = GameState.getActivePlayers(state);
      expect(activePlayers).toHaveLength(5);
      expect(activePlayers.every((p) => !p.isEliminated)).toBe(true);
    });

    it('should filter out eliminated players', () => {
      const state = createMockGameState();
      state.players[0].isEliminated = true;
      state.players[2].isEliminated = true;

      const activePlayers = GameState.getActivePlayers(state);
      expect(activePlayers).toHaveLength(3);
      expect(activePlayers.map((p) => p.id)).toEqual(['2', '4', '5']);
    });

    it('should return empty array when all players are eliminated', () => {
      const state = createMockGameState();
      state.players.forEach((p) => {
        p.isEliminated = true;
      });

      const activePlayers = GameState.getActivePlayers(state);
      expect(activePlayers).toHaveLength(0);
    });
  });

  describe('getActiveSpies', () => {
    it('should return only active spy players', () => {
      const state = createMockGameState();
      const activeSpies = GameState.getActiveSpies(state);
      expect(activeSpies).toHaveLength(1);
      expect(activeSpies[0].role).toBe('spy');
      expect(activeSpies[0].id).toBe('4');
    });

    it('should filter out eliminated spies', () => {
      const state = createMockGameState();
      state.players[3].isEliminated = true; // Eliminate the spy

      const activeSpies = GameState.getActiveSpies(state);
      expect(activeSpies).toHaveLength(0);
    });

    it('should return multiple active spies', () => {
      const state = createMockGameState();
      // Add another spy
      state.players.push({
        id: '6',
        name: 'Player 6',
        role: 'spy',
        isEliminated: false,
      });

      const activeSpies = GameState.getActiveSpies(state);
      expect(activeSpies).toHaveLength(2);
      expect(activeSpies.every((p) => p.role === 'spy')).toBe(true);
      expect(activeSpies.every((p) => !p.isEliminated)).toBe(true);
    });
  });

  describe('getActiveCivilians', () => {
    it('should return only active civilian players', () => {
      const state = createMockGameState();
      const activeCivilians = GameState.getActiveCivilians(state);
      expect(activeCivilians).toHaveLength(4);
      expect(activeCivilians.every((p) => p.role === 'civilian')).toBe(true);
      expect(activeCivilians.every((p) => !p.isEliminated)).toBe(true);
    });

    it('should filter out eliminated civilians', () => {
      const state = createMockGameState();
      state.players[0].isEliminated = true; // Eliminate a civilian
      state.players[1].isEliminated = true; // Eliminate another civilian

      const activeCivilians = GameState.getActiveCivilians(state);
      expect(activeCivilians).toHaveLength(2);
      expect(activeCivilians.map((p) => p.id)).toEqual(['3', '5']);
    });

    it('should return empty array when all civilians are eliminated', () => {
      const state = createMockGameState();
      state.players.forEach((p) => {
        if (p.role === 'civilian') {
          p.isEliminated = true;
        }
      });

      const activeCivilians = GameState.getActiveCivilians(state);
      expect(activeCivilians).toHaveLength(0);
    });
  });
});

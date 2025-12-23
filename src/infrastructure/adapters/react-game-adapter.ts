import { useState, useEffect, useCallback } from 'react';
import type { GameState, GameConfig } from '@/domain';
import { GameService } from '@/application/game-service';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { LocalStorageGameRepository } from '../repositories/LocalStorageGameRepository';

export interface UseGameReturn {
  gameState: GameState | null;
  isLoading: boolean;
  startGame: (config: GameConfig, playerNames: string[]) => Promise<void>;
  submitVote: (voterId: string, votedPlayerId: string) => Promise<void>;
  finishVoting: () => Promise<void>;
  nextDiscussionPlayer: () => Promise<void>;
  resetDiscussion: () => Promise<void>;
  updateDiscussionTime: (time: number) => Promise<void>;
  resetGame: () => Promise<void>;
  getVoteResults: (gameState: GameState) => ReturnType<GameService['getVoteResults']>;
  getPlayerWithMostVotes: (gameState: GameState) => string | null;
}

/**
 * Creates a React hook that provides game functionality
 * This adapter bridges between React state and the GameService
 */
export function useGameAdapter(): UseGameReturn {
  const [gameService] = useState(
    () => new GameService(new CategoryRepository(), new LocalStorageGameRepository())
  );
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load game state on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const loadedState = await gameService.loadGameState();
        setGameState(loadedState);
      } catch (error) {
        console.error('Failed to load game state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadState();
  }, [gameService]);

  const startGame = useCallback(
    async (config: GameConfig, playerNames: string[]) => {
      setIsLoading(true);
      try {
        const newState = await gameService.startGame(config, playerNames);
        setGameState(newState);
      } catch (error) {
        console.error('Failed to start game:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [gameService]
  );

  const submitVote = useCallback(
    async (voterId: string, votedPlayerId: string) => {
      if (!gameState) return;
      try {
        const updatedState = await gameService.submitVote(gameState, voterId, votedPlayerId);
        setGameState(updatedState);
      } catch (error) {
        console.error('Failed to submit vote:', error);
        throw error;
      }
    },
    [gameService, gameState]
  );

  const finishVoting = useCallback(async () => {
    if (!gameState) return;
    try {
      const updatedState = await gameService.finishVoting(gameState);
      setGameState(updatedState);
    } catch (error) {
      console.error('Failed to finish voting:', error);
      throw error;
    }
  }, [gameService, gameState]);

  const nextDiscussionPlayer = useCallback(async () => {
    if (!gameState) return;
    try {
      const updatedState = await gameService.nextDiscussionPlayer(gameState);
      setGameState(updatedState);
    } catch (error) {
      console.error('Failed to move to next player:', error);
      throw error;
    }
  }, [gameService, gameState]);

  const resetDiscussion = useCallback(async () => {
    if (!gameState) return;
    try {
      const updatedState = await gameService.resetDiscussion(gameState);
      setGameState(updatedState);
    } catch (error) {
      console.error('Failed to reset discussion:', error);
      throw error;
    }
  }, [gameService, gameState]);

  const updateDiscussionTime = useCallback(
    async (time: number) => {
      if (!gameState) return;
      try {
        const updatedState = await gameService.updateDiscussionTime(gameState, time);
        setGameState(updatedState);
      } catch (error) {
        console.error('Failed to update discussion time:', error);
        throw error;
      }
    },
    [gameService, gameState]
  );

  const resetGame = useCallback(async () => {
    try {
      await gameService.clearGameState();
      setGameState(null);
    } catch (error) {
      console.error('Failed to reset game:', error);
      throw error;
    }
  }, [gameService]);

  const getVoteResults = useCallback(
    (state: GameState) => {
      return gameService.getVoteResults(state);
    },
    [gameService]
  );

  const getPlayerWithMostVotes = useCallback(
    (state: GameState) => {
      return gameService.getPlayerWithMostVotes(state);
    },
    [gameService]
  );

  return {
    gameState,
    isLoading,
    startGame,
    submitVote,
    finishVoting,
    nextDiscussionPlayer,
    resetDiscussion,
    updateDiscussionTime,
    resetGame,
    getVoteResults,
    getPlayerWithMostVotes,
  };
}

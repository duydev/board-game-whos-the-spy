import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { GameState, GameConfig } from '@/types/game';
import { initializeGame, eliminatePlayer, getPlayerWithMostVotes } from '@/utils/gameLogic';
import { saveGameState, loadGameState, clearGameState } from '@/utils/storage';

interface GameContextType {
  gameState: GameState | null;
  setGameState: (state: GameState | null) => void;
  startGame: (config: GameConfig, playerNames: string[]) => void;
  submitVote: (voterId: string, votedPlayerId: string) => void;
  finishVoting: () => void;
  nextDiscussionPlayer: () => void;
  resetDiscussion: () => void;
  resetGame: () => void;
  updateDiscussionTime: (time: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState | null>(null);

  // Load game state from localStorage on mount
  useEffect(() => {
    const savedState = loadGameState();
    if (savedState) {
      setGameState(savedState);
    }
  }, []);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    if (gameState) {
      saveGameState(gameState);
    }
  }, [gameState]);

  const startGame = useCallback((config: GameConfig, playerNames: string[]) => {
    const newGameState = initializeGame(config, playerNames);
    setGameState(newGameState);
  }, []);

  const submitVote = useCallback(
    (voterId: string, votedPlayerId: string) => {
      if (!gameState) return;

      setGameState({
        ...gameState,
        votes: {
          ...gameState.votes,
          [voterId]: votedPlayerId,
        },
      });
    },
    [gameState]
  );

  const finishVoting = useCallback(() => {
    if (!gameState) return;

    const eliminatedPlayerId = getPlayerWithMostVotes(gameState);
    if (eliminatedPlayerId) {
      const updatedState = eliminatePlayer(gameState, eliminatedPlayerId);
      setGameState({
        ...updatedState,
        currentRound: updatedState.isGameOver
          ? updatedState.currentRound
          : updatedState.currentRound + 1,
        currentDiscussionPlayerIndex: 0,
        currentVotingPlayerIndex: 0,
        votes: {},
        discussionTimeRemaining: 120,
      });
    }
  }, [gameState]);

  const nextDiscussionPlayer = useCallback(() => {
    if (!gameState) return;

    const activePlayers = gameState.players.filter((p) => !p.isEliminated);
    const nextIndex = (gameState.currentDiscussionPlayerIndex + 1) % activePlayers.length;

    setGameState({
      ...gameState,
      currentDiscussionPlayerIndex: nextIndex,
    });
  }, [gameState]);

  const resetDiscussion = useCallback(() => {
    if (!gameState) return;

    setGameState({
      ...gameState,
      currentDiscussionPlayerIndex: 0,
      currentVotingPlayerIndex: 0,
      votes: {},
      discussionTimeRemaining: 120,
    });
  }, [gameState]);

  const resetGame = useCallback(() => {
    clearGameState();
    setGameState(null);
  }, []);

  const updateDiscussionTime = useCallback(
    (time: number) => {
      if (!gameState) return;

      setGameState({
        ...gameState,
        discussionTimeRemaining: time,
      });
    },
    [gameState]
  );

  return (
    <GameContext.Provider
      value={{
        gameState,
        setGameState,
        startGame,
        submitVote,
        finishVoting,
        nextDiscussionPlayer,
        resetDiscussion,
        resetGame,
        updateDiscussionTime,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

import React, { createContext, useContext } from 'react';
import { useGameAdapter, type UseGameReturn } from '@/infrastructure/adapters/react-game-adapter';

const GameContext = createContext<UseGameReturn | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const gameAdapter = useGameAdapter();

  return <GameContext.Provider value={gameAdapter}>{children}</GameContext.Provider>;
};

export const useGame = (): UseGameReturn => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

import type { GameState } from '@/types/game';
import { STORAGE_KEYS } from '@/types/storage';

export const saveGameState = (gameState: GameState): void => {
  try {
    const serialized = JSON.stringify(gameState);
    localStorage.setItem(STORAGE_KEYS.GAME_STATE, serialized);
  } catch (error) {
    console.error('Error saving game state to localStorage:', error);
  }
};

export const loadGameState = (): GameState | null => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
    if (!serialized) return null;
    return JSON.parse(serialized) as GameState;
  } catch (error) {
    console.error('Error loading game state from localStorage:', error);
    return null;
  }
};

export const clearGameState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
  } catch (error) {
    console.error('Error clearing game state from localStorage:', error);
  }
};

export const savePlayerNames = (names: string[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PLAYER_NAMES, JSON.stringify(names));
  } catch (error) {
    console.error('Error saving player names to localStorage:', error);
  }
};

export const loadPlayerNames = (): string[] | null => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEYS.PLAYER_NAMES);
    if (!serialized) return null;
    return JSON.parse(serialized) as string[];
  } catch (error) {
    console.error('Error loading player names from localStorage:', error);
    return null;
  }
};

export const clearPlayerNames = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.PLAYER_NAMES);
  } catch (error) {
    console.error('Error clearing player names from localStorage:', error);
  }
};

import type { IGameStorageRepository } from '@/domain/repositories/IGameStorageRepository';
import type { GameState } from '@/domain/entities/GameState';
import { STORAGE_KEYS } from './constants';

export class LocalStorageGameRepository implements IGameStorageRepository {
  async saveGameState(gameState: GameState): Promise<void> {
    try {
      const serialized = JSON.stringify(gameState);
      localStorage.setItem(STORAGE_KEYS.GAME_STATE, serialized);
      return Promise.resolve();
    } catch (error) {
      console.error('Error saving game state to localStorage:', error);
      return Promise.reject(error);
    }
  }

  async loadGameState(): Promise<GameState | null> {
    try {
      const serialized = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
      if (!serialized) return Promise.resolve(null);
      return Promise.resolve(JSON.parse(serialized) as GameState);
    } catch (error) {
      console.error('Error loading game state from localStorage:', error);
      return Promise.resolve(null);
    }
  }

  async clearGameState(): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
      return Promise.resolve();
    } catch (error) {
      console.error('Error clearing game state from localStorage:', error);
      return Promise.reject(error);
    }
  }
}

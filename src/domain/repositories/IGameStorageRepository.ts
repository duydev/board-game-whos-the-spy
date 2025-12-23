import type { GameState } from '../entities/GameState';

export interface IGameStorageRepository {
  saveGameState(state: GameState): Promise<void>;
  loadGameState(): Promise<GameState | null>;
  clearGameState(): Promise<void>;
}

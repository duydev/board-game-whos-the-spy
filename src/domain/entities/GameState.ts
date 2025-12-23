import type { Player } from './Player';
import type { GameConfig } from './GameConfig';
import type { WordPair } from '../value-objects/WordPair';

export type Winner = 'civilians' | 'spies' | null;

export interface GameState {
  config: GameConfig;
  players: Player[];
  currentRound: number;
  currentDiscussionPlayerIndex: number;
  currentVotingPlayerIndex: number;
  votes: Record<string, string>; // playerId -> votedPlayerId
  wordPair: WordPair | null; // Cặp từ được chọn
  winner: Winner;
  isGameOver: boolean;
  discussionTimeRemaining: number; // seconds
}

export const GameState = {
  getActivePlayers: (state: GameState): Player[] => {
    return state.players.filter((p) => !p.isEliminated);
  },
  getActiveSpies: (state: GameState): Player[] => {
    return GameState.getActivePlayers(state).filter((p) => p.role === 'spy');
  },
  getActiveCivilians: (state: GameState): Player[] => {
    return GameState.getActivePlayers(state).filter((p) => p.role === 'civilian');
  },
};

export type Role = 'civilian' | 'spy';

export interface Player {
  id: string;
  name: string;
  role: Role;
  word?: string; // Từ khóa cho dân thường, undefined cho gián điệp
  isEliminated: boolean;
  voteCount?: number; // Số vote nhận được trong vòng hiện tại
}

export type Category = string;

export interface GameConfig {
  totalPlayers: number;
  numberOfSpies: number;
  category: Category | 'random';
}

export interface GameState {
  config: GameConfig;
  players: Player[];
  currentRound: number;
  currentDiscussionPlayerIndex: number;
  currentVotingPlayerIndex: number;
  votes: Record<string, string>; // playerId -> votedPlayerId
  wordPair: [string, string] | null; // Cặp từ được chọn
  winner: 'civilians' | 'spies' | null;
  isGameOver: boolean;
  discussionTimeRemaining: number; // seconds
}

export interface VoteResult {
  playerId: string;
  playerName: string;
  voteCount: number;
}

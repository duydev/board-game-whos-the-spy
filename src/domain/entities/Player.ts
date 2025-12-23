export type Role = 'civilian' | 'spy';

export interface Player {
  id: string;
  name: string;
  role: Role;
  word?: string; // Từ khóa cho dân thường, undefined cho gián điệp
  isEliminated: boolean;
  voteCount?: number; // Số vote nhận được trong vòng hiện tại
}

export const Player = {
  isSpy: (player: Player): boolean => player.role === 'spy',
  isCivilian: (player: Player): boolean => player.role === 'civilian',
  isActive: (player: Player): boolean => !player.isEliminated,
  hasWord: (player: Player): boolean => player.word !== undefined,
};

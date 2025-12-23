export const generatePlayerId = (): string => {
  return `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

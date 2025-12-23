import type { GameState, Player, Role, GameConfig } from '@/types/game';
import categoriesData from '@/data/categories.json';

type CategoriesData = Record<string, [string, string][]>;

const categories = categoriesData as unknown as CategoriesData;

export const generatePlayerId = (): string => {
  return `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const selectRandomWordPair = (category: string | 'random'): [string, string] => {
  let selectedCategory: string;

  if (category === 'random') {
    const categoryKeys = Object.keys(categories);
    const randomIndex = Math.floor(Math.random() * categoryKeys.length);
    selectedCategory = categoryKeys[randomIndex];
  } else {
    selectedCategory = category;
  }

  const wordPairs = categories[selectedCategory];
  if (!wordPairs || wordPairs.length === 0) {
    throw new Error(`No word pairs found for category: ${selectedCategory}`);
  }

  const randomIndex = Math.floor(Math.random() * wordPairs.length);
  return wordPairs[randomIndex];
};

export const assignRoles = (
  playerNames: string[],
  numberOfSpies: number,
  wordPair: [string, string]
): Player[] => {
  const players: Player[] = playerNames.map((name) => ({
    id: generatePlayerId(),
    name,
    role: 'civilian' as Role,
    isEliminated: false,
  }));

  // Randomly assign spy roles
  const spyIndices: number[] = [];
  while (spyIndices.length < numberOfSpies) {
    const randomIndex = Math.floor(Math.random() * players.length);
    if (!spyIndices.includes(randomIndex)) {
      spyIndices.push(randomIndex);
    }
  }

  // Assign words to players
  const [word1, word2] = wordPair;
  let word1Count = 0;
  let word2Count = 0;

  players.forEach((player, index) => {
    if (spyIndices.includes(index)) {
      // Spy doesn't get a word
      player.role = 'spy';
    } else {
      // Assign words to civilians, distribute evenly
      if (word1Count <= word2Count) {
        player.word = word1;
        word1Count++;
      } else {
        player.word = word2;
        word2Count++;
      }
    }
  });

  return players;
};

export const checkWinCondition = (players: Player[]): 'civilians' | 'spies' | null => {
  const activePlayers = players.filter((p) => !p.isEliminated);
  const activeSpies = activePlayers.filter((p) => p.role === 'spy');
  const activeCivilians = activePlayers.filter((p) => p.role === 'civilian');

  // Civilians win if all spies are eliminated
  if (activeSpies.length === 0) {
    return 'civilians';
  }

  // Spies win if number of spies equals or exceeds number of civilians
  if (activeSpies.length >= activeCivilians.length) {
    return 'spies';
  }

  return null;
};

export const getAvailableCategories = (): string[] => {
  return Object.keys(categories);
};

export const getCategoryDisplayName = (category: string): string => {
  return category;
};

export const initializeGame = (config: GameConfig, playerNames: string[]): GameState => {
  const wordPair = selectRandomWordPair(config.category);
  const players = assignRoles(playerNames, config.numberOfSpies, wordPair);

  return {
    config,
    players,
    currentRound: 1,
    currentDiscussionPlayerIndex: 0,
    currentVotingPlayerIndex: 0,
    votes: {},
    wordPair,
    winner: null,
    isGameOver: false,
    discussionTimeRemaining: 120, // 2 minutes
  };
};

export const eliminatePlayer = (gameState: GameState, playerId: string): GameState => {
  const updatedPlayers = gameState.players.map((player) =>
    player.id === playerId ? { ...player, isEliminated: true } : player
  );

  const winner = checkWinCondition(updatedPlayers);

  return {
    ...gameState,
    players: updatedPlayers,
    winner,
    isGameOver: winner !== null,
    votes: {}, // Reset votes for next round
  };
};

export const getVoteResults = (
  gameState: GameState
): Array<{ playerId: string; playerName: string; voteCount: number }> => {
  const voteCounts: Record<string, number> = {};

  Object.values(gameState.votes).forEach((votedPlayerId) => {
    voteCounts[votedPlayerId] = (voteCounts[votedPlayerId] || 0) + 1;
  });

  return gameState.players
    .filter((p) => !p.isEliminated)
    .map((player) => ({
      playerId: player.id,
      playerName: player.name,
      voteCount: voteCounts[player.id] || 0,
    }))
    .sort((a, b) => b.voteCount - a.voteCount);
};

export const getPlayerWithMostVotes = (gameState: GameState): string | null => {
  const results = getVoteResults(gameState);
  if (results.length === 0) return null;

  const maxVotes = results[0].voteCount;
  if (maxVotes === 0) return null; // No votes cast

  // Check for ties
  const topVoted = results.filter((r) => r.voteCount === maxVotes);
  if (topVoted.length > 1) {
    // Tie - randomly select one (or could return null to handle differently)
    const randomIndex = Math.floor(Math.random() * topVoted.length);
    return topVoted[randomIndex].playerId;
  }

  return results[0].playerId;
};

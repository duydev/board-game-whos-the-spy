export type Category = string;
export type WordPair = [string, string];

export const WordPair = {
  isValid: (pair: WordPair): boolean => {
    return pair.length === 2 && pair[0].length > 0 && pair[1].length > 0;
  },
};

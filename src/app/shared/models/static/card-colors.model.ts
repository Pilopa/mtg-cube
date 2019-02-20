export enum ColorSymbol {
  GENERIC = 'a',
  WHITE = 'w',
  BLUE = 'u',
  BLACK = 'b',
  RED = 'r',
  GREEN = 'g',
  COLORLESS = 'c'
}

/**
 * A map describing how often each color symbol appears
 * in mana costs.
 */
export type ColorSymbolDistribution = {
  [colorCode in ColorSymbol]?: number;
};

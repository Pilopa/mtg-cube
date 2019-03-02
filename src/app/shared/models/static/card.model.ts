import { SetDefinitionModel } from './set-definition.model';
import { ColorSymbolDistribution } from './card-colors.model';

/**
 * Represents minified information about a card stored in the
 * static card database.
 */
export interface MinifiedCardModel {

  /**
   * Name
   */
  n: string;

  /**
   * Rarity
   *
   * undefined = common
   * 1 = uncommon
   * 2 = rare
   * 3 = mythic
   */
  r: 3 | 2 | 1 | undefined;

  /**
   * Sets this card has been printed in
   */
  s: SetDefinitionModel | undefined;

  /**
   * Supertypes of the card, if the card only has one supertype,
   * this value is a number. If the card has no supertypes,
   * this value is omitted.
   */
  st: number[] | number | undefined;

  /**
   * Types of the card, if the card only has one type,
   * this value is a number. If the card has no types,
   * this value is omitted.
   */
  t: number[] | number | undefined;

  /**
   * Subtypes of the card, if the card only has one subtype,
   * this value is a number. If the card has no subtypes,
   * this value is omitted.
   */
  sb: number[] | number | undefined;

  /**
   * The power of the card if it is a creature, otherwise undefined.
   */
  p: string | undefined;

  /**
   * The toughness of the card if it is a creature, otherwise undefined.
   */
  d: string | undefined;

  /**
   * The loyalty of the card if it is a planeswalker, otherwise undefined.
   */
  l: number | undefined;

  /**
   * The cost of the card represented as color symbols mapped to
   * the number of occurrences in the cards mana cost.
   * Undefined if the card does not have any cost (e.g. a land).
   */
  c: ColorSymbolDistribution | undefined;

  /**
   * The converted mana cost of the card, undefined if its zero (0);
   */
  i: number | undefined;

  /**
   * The other side of the card if it is a split, transform or meld card,
   * otherwise undefined.
   *
   * Not all original properties might be available on the other side
   * to avoid duplication of information.
   */
  o: Partial<MinifiedCardModel> | undefined;

}

export interface CardMapModel {
  [cardHash: string]: MinifiedCardModel;
}

export interface CardVersionMapModel {
  [cardId: string]: string;
}

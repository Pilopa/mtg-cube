export interface CubeCardsModel {
  cards: CubeCardInstanceModel;
}

/**
 * Represents an individual card in a cube.
 */
export interface CubeCardInstanceModel extends CubeCardModel {
  id: string;
}

/**
 * Represents an individual printing of a card.
 */
export interface CubeCardModel {
  /**
   * Card Id
   */
  cid: string;

  /**
   * Multiverseid
   */
  mvid: number;

  /**
   * The id of the set this card is in
   */
  sid: string;
}

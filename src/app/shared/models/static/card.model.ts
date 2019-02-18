import { SetDefinitionModel } from '../set-definition.model';

export interface StaticCardModel {

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
  r: 1 | 2 | 3 | undefined;

  /**
   * Sets
   *
   */
  s: SetDefinitionModel | undefined;

}

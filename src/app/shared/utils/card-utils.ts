import { MinifiedCardModel } from '../models/static/card.model';
import { CubeCardModel } from '../models/firestore/cube-cards/cube-cards.model';

export function getCubeCardModels(staticCardData?: MinifiedCardModel): CubeCardModel[] {
  if (!staticCardData || !staticCardData.s) {
    return [];
  }

  return Object.entries(staticCardData.s).map(([sid, mvid]) => ({
    cid: getCardNameId(staticCardData.n),
    sid,
    mvid
  }));
}

export function getCardNameId(cardName: string) {
  return cardName.trim().toLowerCase().replace(/[^a-zA-Z0-9-_.!*~'()]/g, '');
}

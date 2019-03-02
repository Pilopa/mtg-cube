import { CardImageSize } from '@app/shared/models/card-image.model';
import { LayoutSize } from '../models/layout-size.model';


export function getNextSize(imageSize: CardImageSize) {
  switch (imageSize) {
    case CardImageSize.SMALL:
      return CardImageSize.MEDIUM;
    case CardImageSize.MEDIUM:
      return CardImageSize.LARGE;
    default:
      return null;
  }
}

export function layoutSize2CardImageSize(layoutSize: LayoutSize) {
  switch (layoutSize) {
    case LayoutSize.SMALL:
      return CardImageSize.SMALL;
    case LayoutSize.MEDIUM:
      return CardImageSize.MEDIUM;
    case LayoutSize.LARGE:
      return CardImageSize.LARGE;
    default:
      return CardImageSize.MEDIUM;
  }
}

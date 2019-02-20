import { CardImageSize } from '@app/shared/models/card-image.model';


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

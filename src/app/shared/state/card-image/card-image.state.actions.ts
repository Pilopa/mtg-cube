import { CardImageSize } from '@app/shared/models/card-image.model';

export class LoadImage {
  static readonly type = '[CardImages] LoadImage]';
  constructor(public readonly multiverseId: number, public readonly size: CardImageSize) {}
}

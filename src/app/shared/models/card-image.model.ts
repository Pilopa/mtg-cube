import { Observable } from 'rxjs';

export enum CardImageSize {
  SMALL = 'small',
  MEDIUM = 'normal',
  LARGE = 'large'
}
/**
 * A map describing the image cache.
 *
 * string = image data url
 * observable = pending image load request
 * undefined = image load has not yet been attempted
 * null = image load has been attempted but there is no image for that size (server returned 404)
 */
export interface CardImageMap {
  [multiverseId: number]: {
    [cardImageSize in CardImageSize]?: string | undefined | null | Observable<string | null>
  };
}

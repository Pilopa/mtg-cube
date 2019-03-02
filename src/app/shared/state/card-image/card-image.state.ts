import { State, Action, StateContext, Selector } from '@ngxs/store';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CardImageSize, CardImageMap } from '@app/shared/models/card-image.model';
import * as CardImageActions from './card-image.state.actions';
import { Observable, throwError, of, from, concat } from 'rxjs';
import { getNextSize } from '@app/shared/utils/card-image-utils';
import { tap, catchError, switchMap, first, shareReplay, filter, switchMapTo } from 'rxjs/operators';
import { blob2ImageUrl } from '../../utils/blob-to-image-url';
import produce from 'immer';
import { AppError } from '../../models/error.model';

@State<CardImageMap>({
  name: 'cardImages',
  defaults: { }
})
export class CardImageState {

  private static getSizesToTry(size: CardImageSize) {
    if (size === CardImageSize.SMALL) {
      return [CardImageSize.SMALL, CardImageSize.MEDIUM, CardImageSize.LARGE];
    } else if (size === CardImageSize.MEDIUM) {
      return [CardImageSize.MEDIUM, CardImageSize.LARGE, CardImageSize.SMALL];
    } else {
      return [CardImageSize.LARGE, CardImageSize.MEDIUM, CardImageSize.SMALL];
    }
  }

  @Selector()
  public static getCardImageFn(state: CardImageMap): GetImageFn {
    return (multiverseId, size) => {
      const sizesToTry = CardImageState.getSizesToTry(size);
      const cardImages = state[multiverseId];
      let lastValue;

      // Determine the sizes to try to load by looking at current cache
      if (cardImages) {
        for (const sizeToTry of sizesToTry) {
          const cardImage = cardImages[sizeToTry];
          // If there already is a cached image or an active load request, dont start another request
          if (typeof cardImage === 'string') {
            return cardImage;
          }
          lastValue = cardImage;
        }
        return lastValue instanceof Observable ? undefined : lastValue;
      }
      return undefined;
    };
  }

  constructor(private readonly http: HttpClient) {}

  @Action(CardImageActions.LoadImage)
  loadImage({getState, setState}: StateContext<CardImageMap>, { multiverseId, size }: CardImageActions.LoadImage) {
    const cardImages = getState()[multiverseId];
    let sizesToTry: CardImageSize[] = [];

    // Determine the sizes to try to load by looking at current cache
    if (cardImages) {
      do {
        const cardImage = cardImages[size];
        // If there already is a cached image or an active load request, dont start another request
        if (cardImage instanceof Observable || typeof cardImage === 'string') {
          return cardImage;
        } else if (cardImage === undefined) {
          sizesToTry.push(size);
        }
      } while (size = getNextSize(size) as CardImageSize);
    } else {
      // If there is no cache yet for that card, try sizes in an order that makes sense
      sizesToTry = CardImageState.getSizesToTry(size);
    }

    // Perform Load
    if (sizesToTry.length) {
      // Define function to load one individual image size
      const load = sizeToLoad => {
        const observable = of().pipe(
          // Set loading state
          tap(_ => setState(produce(getState(), draft => this.setImageValue(draft, multiverseId, sizeToLoad, observable)))),
          // Start image load request
          switchMapTo(this.getImage(multiverseId, sizeToLoad)),
          // Store result
          tap(result => setState(produce(getState(), draft => this.setImageValue(draft, multiverseId, sizeToLoad, result)))),
          catchError((error: AppError) => {
            // Set undefined on error to allow for retry
            setState(produce(getState(), draft => this.setImageValue(draft, multiverseId, sizeToLoad, undefined)));
            return throwError(error);
          })
        );
        return observable;
      };

      // Attempts to load the sizes in order, one after another
      // Cancels all further requests if one is successful
      // Because the observable is cached, it uses the shareReplay operator to make the observable hot
      // and the first operator to make it completable
      return concat(...sizesToTry.map(s => load(s))).pipe(
        filter(result => result !== null),
        first(),
        shareReplay(),
        first()
      );
    } else {
      // No image found
      return null;
    }
  }

  private getImage(multiverseId: number, size: CardImageSize): Observable<string | null> {
    return from(this.http.get<Blob>(`https://api.scryfall.com/cards/multiverse/${multiverseId}?format=image&version=${size}`, {
      responseType: 'blob' as 'json'
    })).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          // Image not found
          return of(null);
        } else {
          return throwError({
            code: 'card-image/image-load-failed',
            message: `Card image with multiverseid (${multiverseId}) could not be loaded for size (${size})`
          } as AppError);
        }
      }),
      switchMap(result => result ? blob2ImageUrl(result) : of(result))
    );
  }

  private setImageValue(cache: CardImageMap, multiverseId: number, size: CardImageSize, value: any) {
    if (!cache[multiverseId]) { cache[multiverseId] = {}; }
    const imageSizeMap = cache[multiverseId];
    imageSizeMap[size] = value;
  }

}

/**
 * string: image url (might not be in requested size)
 * null: no image for that multiverseid available
 * undefined: image not yet loaded
 */
export type GetImageFn = (multiverseId: number, size: CardImageSize) => string | null | undefined;

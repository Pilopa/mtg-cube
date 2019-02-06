import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, switchMap, map, take, tap } from 'rxjs/operators';
import { getObjectPathValue } from '@app/shared/utils/object-path-value';
import * as elasticlunr from 'elasticlunr';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CardIndexService {

  private readonly _indexVersions$$ = new BehaviorSubject(undefined);
  private readonly _indexVersions$ = this._indexVersions$$.pipe(
    filter(index => index !== undefined)
  );

  constructor(private http: HttpClient) {
    http.get<any>(`assets/indices/versions-${environment.indexVersionHash}.json`).subscribe(
      value => this._indexVersions$$.next(value)
    );
  }

  getCardIndex(path: string) {
    const urlPath = path.replace(/[\.]/g, '/');
    return this.getIndexVersion(path).pipe(
      switchMap(versionHash => this.http.get(`assets/indices/${urlPath}-${versionHash}.json`) as Observable<string[]>),
      take(1)
    );
  }

  getElasticIndex(type: 'name' | 'text' | 'combined', query: string, and: boolean = true, partial: boolean = false) {
    return this.getIndexVersion(type).pipe(
      switchMap(versionHash => this.http.get(`assets/indices/${type}-${versionHash}.json`)),
      map(indexObject => this.performElasticlunrIndexing(indexObject, query, and, partial)),
      take(1)
    );
  }

  private getIndexVersion(indexPath: string) {
    return this._indexVersions$.pipe(
      map(versions => getObjectPathValue(versions, indexPath) as string[] | undefined)
    );
  }

  private performElasticlunrIndexing(indexContent: any, query: string, and: boolean = true, partial: boolean = false) {
    const indexObject = elasticlunr.Index.load(indexContent);
    const indexResult = indexObject.search(query, {
      expand: !!partial,
      bool: and ? 'AND' : 'OR'
    });
    return indexResult.map(value => (value.ref as string).toLowerCase());
  }

}

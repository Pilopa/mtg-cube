import { forkJoin, ObservableInput, of, Observable } from 'rxjs';

export default function safeForkJoin<T>(sources: ObservableInput<T>[], defaultValue: T[] = []): Observable<T[]> {
  if (sources.length) {
    return forkJoin(sources);
  } else {
    return of(defaultValue);
  }
}

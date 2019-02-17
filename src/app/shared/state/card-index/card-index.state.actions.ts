export class UpdateIndexVersions {
  static readonly type = '[CardIndex] UpdateIndexVersions';
}

export class LoadIndex {
  static readonly type = '[CardIndex] LoadIndex';
  constructor(public readonly path: string[]) {}
}

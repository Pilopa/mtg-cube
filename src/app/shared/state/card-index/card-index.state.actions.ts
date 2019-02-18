export class UpdateIndexVersions {
  static readonly type = '[CardIndex] UpdateIndexVersions';
}

export class LoadIndices {
  static readonly type = '[CardIndex] LoadIndices';
  public readonly paths: string[][];
  constructor(...paths: string[][]) {
    this.paths = paths;
  }
}

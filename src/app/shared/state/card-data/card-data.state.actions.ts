export class UpdateIndexVersions {
  static readonly type = '[CardData] UpdateIndexVersions';
}

export class LoadCardData {
  static readonly type = '[CardData] LoadCardData';
  constructor(public readonly hash: string) {}
}

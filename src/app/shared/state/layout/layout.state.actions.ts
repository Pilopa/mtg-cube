import { LayoutSize } from '@app/shared/models/layout-size.model';

export class SetSize {
  static readonly type = '[Layout] SetSize';
  constructor(public readonly size: LayoutSize) {}
}

export class SetNavVisible {
  static readonly type = '[Layout] SetNavVisible]';
  constructor(public readonly flag: boolean) {}
}

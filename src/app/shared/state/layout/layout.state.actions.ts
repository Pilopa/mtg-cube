import { LayoutSize } from '@app/shared/models/layout-size.model';

export class SetSize {
  static readonly type = '[Layout] SetSize';
  constructor(public readonly size: LayoutSize) {}
}

export class SetNavVisible {
  static readonly type = '[Layout] SetNavVisible';
  constructor(public readonly flag: boolean) {}
}

export class SetSideContentVisible {
  static readonly type = '[Layout] SetSideContentVisible';
  constructor(public readonly flag: boolean) {}
}

export class ToggleSideContentVisible {
  static readonly type = '[Layout] ToggleSideContentVisible';
}

export class ResetPageLayout {
  static readonly type = '[Layout] ResetPageLayout';
}

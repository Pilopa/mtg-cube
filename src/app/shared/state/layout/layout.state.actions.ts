import { LayoutSize } from '@app/shared/models/layout-size.model';
import { TemplateRef } from '@angular/core';

export class SetSize {
  static readonly type = '[Layout] SetSize';
  constructor(public readonly size: LayoutSize) {}
}

export class SetNavVisible {
  static readonly type = '[Layout] SetNavVisible';
  constructor(public readonly flag: boolean) {}
}

export class ResetPageLayout {
  static readonly type = '[Layout] ResetPageLayout';
}

export class SetToolbarTemplate {
  static readonly type = '[Layout] SetToolbarTemplate';
  constructor(public readonly template?: TemplateRef<any>) {}
}

export class SetSideContentTemplate {
  static readonly type = '[Layout] SetSideContentTemplate';
  constructor(public readonly template?: TemplateRef<any>) {}
}

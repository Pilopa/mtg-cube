export interface NavItemModel {
  label: string;
  icon: string;
  path: string;
  children?: NavItemModel[];
}

export interface NavSection {
  orderValue: number;
  title: string;
  children: NavItemModel[];
}

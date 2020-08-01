export type ViewStateOrder = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export interface ViewState<TAnimation> {
  name?: string;
  order: ViewStateOrder | number;
  animations?: TAnimation[];
}

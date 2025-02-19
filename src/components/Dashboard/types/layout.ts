import { Square } from "./square";

export interface Layout {
  rows: number;
  cols: number;
  grid: Square[][];
}

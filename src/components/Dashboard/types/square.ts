import { Product } from "./product";

export type SquareType =
  | "empty"
  | "products"
  | "cash_register"
  | "entrance"
  | "exit";

export interface Square {
  type: SquareType;
  products: Product[];
  row: number;
  col: number;
}

import { Product } from "./product";

export type SquareType =
  | "empty"
  | "aisle"
  | "cash_register"
  | "entrance"
  | "exit";

export type Square = {
  type: SquareType;
  products: Product[];
  row: number;
  col: number;
};

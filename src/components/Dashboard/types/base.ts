export interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

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

export interface Layout {
  rows: number;
  cols: number;
  grid: Square[][];
}


export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

export type SquareType =
  | "empty"
  | "products"
  | "cash_register"
  | "entrance"
  | "exit";

export interface Square {
  type: SquareType;
  productIds: String[];
  row: number;
  col: number;
}

export interface Supermarket {
  id: string;
  owner: string;
  name: string;
  layout: Square[][];
  products: Product[];
}


export interface PathData {
  // Distance matrix - dist[i][j] is the shortest distance from node i to node j
  dist: number[][];

  // Next hop matrix - next[i][j] is the next node on the shortest path from i to j
  next: number[][];

  // Metadata about when and how the path data was created
  metadata: {
    timestamp: string;
    rowCount: number;
    colCount: number;
  };
}

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
  pathData?: PathData; // Added optional pathData property
}
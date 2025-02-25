interface BaseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  owner?: string;
}

// Enum for square types
export type SquareType =
  | "empty"
  | "products"
  | "cash_register"
  | "entrance"
  | "exit";

// Rating object structure for products
export interface Rating {
  rate: number;
  count: number;
}

// Supermarket entity
export interface Supermarket extends BaseModel {
  name: string;
  address: string;
  // Related entities (populated by GraphQL resolvers)
  layout?: Layout;
  products?: Product[];
}

// Layout entity
export interface Layout extends BaseModel {
  rows: number;
  cols: number;
  supermarketID: string;
  // Related entities
  supermarket?: Supermarket;
  squares?: Square[];
}

// Square entity representing a cell in the layout grid
export interface Square extends BaseModel {
  type: SquareType;
  row: number;
  col: number;
  layoutID: string;
  // Related entities
  layout?: Layout;
  products?: Product[];
}

// Product entity
export interface Product extends BaseModel {
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: Rating;
  supermarketID: string;
  squareID?: string; // Optional - products can exist without being placed on the grid
  // Related entities
  supermarket?: Supermarket;
  square?: Square;
}

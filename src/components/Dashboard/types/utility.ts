import { Layout, Product, Square, Supermarket } from "./index";

export interface GridLayout extends Layout {
  grid: Square[][];
}

// Utility types for GraphQL responses
export interface GraphQLResult<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: any[];
    path?: string[];
    extensions?: any;
  }>;
}

// Example GraphQL response types
export interface GetSupermarketResponse {
  getSupermarket: Supermarket & {
    layout?: Layout & {
      squares?: {
        items: Square[];
      };
    };
    products?: {
      items: Product[];
    };
  };
}

export interface ListSquaresResponse {
  listSquares: {
    items: Square[];
    nextToken?: string;
  };
}

export interface ListProductsResponse {
  listProducts: {
    items: Product[];
    nextToken?: string;
  };
}

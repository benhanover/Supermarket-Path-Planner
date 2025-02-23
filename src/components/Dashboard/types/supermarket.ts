import { Layout } from "./layout";
import { Product } from "./product";

export interface Supermarket {
  id: number;
  name: string;
  address: string;
  layout: Layout;
  products: Product[];
}

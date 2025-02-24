import { Layout } from "./layout";
import { Product } from "./product";

export interface Supermarket {
  id: string;
  name: string;
  address: string;
  layout: Layout;
  products: Product[];
  owner?: string; // ✅ Optional since not always needed
  createdAt?: string; // ✅ Optional timestamp
  updatedAt?: string; // ✅ Optional timestamp
}

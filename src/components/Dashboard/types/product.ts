export interface Product {
  id: string;
  name: string;
  price: number;
}

export const products: Product[] = [
  { id: "p1", name: "Apple", price: 0.99 },
  { id: "p2", name: "Bread", price: 2.49 },
  { id: "p3", name: "Milk", price: 1.79 },
  { id: "p4", name: "Eggs", price: 3.99 },
  { id: "p5", name: "Coffee", price: 5.49 },
];

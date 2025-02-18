export type Aisle = {
  id: string;
  name: string; // "Dairy", "Frozen Foods", etc.
  squares: { row: number; col: number }[]; // Connected squares
};

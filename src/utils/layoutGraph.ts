import { Square } from "../components/Dashboard/types";

const isWalkable = (square: Square): boolean => square.type === "empty";

const toIndex = (row: number, col: number, cols: number) =>
  row * cols + col;

export const buildGraph = (layout: Square[][]): number[][] => {
  const rows = layout.length;
  const cols = layout[0].length;
  const total = rows * cols;
  const INF = Infinity;

  const graph = Array.from({ length: total }, () =>
    Array.from({ length: total }, () => INF)
  );

  for (let i = 0; i < total; i++) graph[i][i] = 0;

  const dirs = [
    [0, 1],  // right
    [0, -1], // left
    [1, 0],  // down
    [-1, 0], // up
  ];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!isWalkable(layout[row][col])) continue;

      const from = toIndex(row, col, cols);

      for (const [dx, dy] of dirs) {
        const r = row + dx, c = col + dy;
        if (
          r >= 0 && r < rows &&
          c >= 0 && c < cols &&
          isWalkable(layout[r][c])
        ) {
          const to = toIndex(r, c, cols);
          graph[from][to] = 1;
        }
      }
    }
  }

  return graph;
};

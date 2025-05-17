import { Square } from "../components/Dashboard/types";

const isWalkable = (square: Square): boolean =>
  ["empty", "entrance", "exit", "cash_register"].includes(square.type);

const toIndex = (row: number, col: number, cols: number) =>
  row * cols + col;

const fromIndex = (index: number, cols: number) => ({
  row: Math.floor(index / cols),
  col: index % cols,
});

export const buildGraph = (layout: Square[][]): number[][] => {
  const rows = layout.length;
  const cols = layout[0].length;
  const total = rows * cols;
  const INF = Infinity;

  // Initialize graph with all Infinity
  const graph = Array.from({ length: total }, () =>
    Array.from({ length: total }, () => INF)
  );

  // Set self-connections to 0
  for (let i = 0; i < total; i++) graph[i][i] = 0;

  // Define orthogonal and diagonal directions
  const orthogonalDirs = [
    [0, 1],  // right
    [0, -1], // left
    [1, 0],  // down
    [-1, 0], // up
  ];

  const diagonalDirs = [
    [1, 1],   // down-right
    [1, -1],  // down-left
    [-1, 1],  // up-right
    [-1, -1], // up-left
  ];

  // Create a lookup map to track which walkable square can access each product square
  // Key: product square index, Value: array of walkable square indices that can access it
  const productAccessMap = new Map<number, number[]>();

  // First pass: identify walkable → product connections
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const fromSquare = layout[row][col];
      const fromIdx = toIndex(row, col, cols);

      // Only consider walkable squares for the first pass
      if (!isWalkable(fromSquare)) continue;

      // Check orthogonal neighbors
      for (const [dx, dy] of orthogonalDirs) {
        const r = row + dx;
        const c = col + dy;

        if (r < 0 || r >= rows || c < 0 || c >= cols) continue;

        const toSquare = layout[r][c];
        const toIdx = toIndex(r, c, cols);

        // If neighbor is a product square, record the connection
        if (toSquare.type === "products") {
          if (!productAccessMap.has(toIdx)) {
            productAccessMap.set(toIdx, []);
          }
          productAccessMap.get(toIdx)!.push(fromIdx);

          // Set walkable → product connection
          graph[fromIdx][toIdx] = 1;
        }
      }
    }
  }

  // Main pass: set all other connections
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const fromSquare = layout[row][col];
      const fromIdx = toIndex(row, col, cols);

      // Handle connections from product squares - can only return to squares that can access them
      if (fromSquare.type === "products") {
        const accessPoints = productAccessMap.get(fromIdx) || [];
        for (const accessPointIdx of accessPoints) {
          // Set product → walkable connection (two-way connection)
          graph[fromIdx][accessPointIdx] = 1;
        }
        continue; // Skip other connection types for product squares
      }

      // Skip non-walkable squares that aren't products
      if (!isWalkable(fromSquare)) continue;

      // Handle orthogonal movements for walkable squares
      for (const [dx, dy] of orthogonalDirs) {
        const r = row + dx;
        const c = col + dy;

        if (r < 0 || r >= rows || c < 0 || c >= cols) continue;

        const toSquare = layout[r][c];
        const toIdx = toIndex(r, c, cols);

        // Allow walkable → walkable
        if (isWalkable(toSquare)) {
          graph[fromIdx][toIdx] = 1;
        }
        // Note: walkable → product connections are handled in the first pass
      }

      // Handle diagonal movements - ONLY BETWEEN EMPTY SQUARES
      if (fromSquare.type === "empty") {
        for (const [dx, dy] of diagonalDirs) {
          const r = row + dx;
          const c = col + dy;

          if (r < 0 || r >= rows || c < 0 || c >= cols) continue;

          const toSquare = layout[r][c];
          const toIdx = toIndex(r, c, cols);

          // Only allow diagonal movement to empty squares
          if (toSquare.type === "empty") {
            graph[fromIdx][toIdx] = Math.SQRT2; // Diagonal distance cost
          }
        }
      }
    }
  }

  // Validation step: Check if the graph is connected where it should be
  // We'll use a simple Floyd-Warshall to compute all shortest paths
  const validateConnectivity = () => {
    // Create a deep copy of the graph for validation
    const tempGraph = graph.map(row => [...row]);

    // Floyd-Warshall algorithm for finding all shortest paths
    for (let k = 0; k < total; k++) {
      for (let i = 0; i < total; i++) {
        for (let j = 0; j < total; j++) {
          if (tempGraph[i][k] !== INF && tempGraph[k][j] !== INF) {
            tempGraph[i][j] = Math.min(tempGraph[i][j], tempGraph[i][k] + tempGraph[k][j]);
          }
        }
      }
    }

    // Find walkable squares that should be reachable but aren't
    const disconnected = [];
    for (let i = 0; i < total; i++) {
      const { row: r1, col: c1 } = fromIndex(i, cols);
      const sq1 = layout[r1][c1];

      if (!isWalkable(sq1) && sq1.type !== "products") continue;

      for (let j = 0; j < total; j++) {
        if (i === j) continue;

        const { row: r2, col: c2 } = fromIndex(j, cols);
        const sq2 = layout[r2][c2];

        if (!isWalkable(sq2) && sq2.type !== "products") continue;

        if (tempGraph[i][j] === INF) {
          disconnected.push([i, j]);
        }
      }
    }

    return disconnected;
  };

  // Fix disconnected paths by adding orthogonal connections where needed
  const disconnected = validateConnectivity();
  if (disconnected.length > 0) {
    console.log(`Found ${disconnected.length} disconnected paths, adding necessary connections`);

    // For each disconnected pair, add direct connections where needed
    // This is a simplified approach - more sophisticated algorithms could be used
    disconnected.forEach(([i, j]) => {
      const srcPos = fromIndex(i, cols);
      const destPos = fromIndex(j, cols);

      // Direct orthogonal connection as fallback
      if (Math.abs(srcPos.row - destPos.row) <= 1 && Math.abs(srcPos.col - destPos.col) <= 1) {
        // Add a direct connection with slightly higher cost to prefer normal paths
        graph[i][j] = Math.max(Math.abs(srcPos.row - destPos.row), Math.abs(srcPos.col - destPos.col)) === 1
          ? 1.1  // Slightly higher cost for orthogonal
          : 1.5; // Slightly higher cost for diagonal
      }
    });
  }

  return graph;
};



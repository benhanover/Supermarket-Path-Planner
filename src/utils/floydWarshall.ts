// floydWarshall.ts
// Implementation of the Floyd-Warshall algorithm for finding all-pairs shortest paths

/**
 * Floyd-Warshall algorithm for finding shortest paths between all pairs of vertices
 * @param graph Adjacency matrix where graph[i][j] is the weight of the edge from i to j
 * @returns Object containing distance matrix and next matrix for path reconstruction
 */
export const floydWarshall = (graph: number[][]): {
  dist: number[][],
  next: number[][]
} => {
  const n = graph.length;

  // Make a copy of the input graph to avoid modifying the original
  const dist = graph.map(row => [...row]);

  // Initialize the next matrix for path reconstruction
  // next[i][j] = k means "to go from i to j, first step is to go from i to k"
  const next = Array.from({ length: n }, () => Array(n).fill(-1));

  // Initialize the next matrix
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (graph[i][j] !== Infinity) {
        next[i][j] = j;
      }
    }
  }

  // Floyd-Warshall algorithm
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        // If vertex k is on the shortest path from i to j, update the distance
        if (dist[i][k] !== Infinity && dist[k][j] !== Infinity) {
          if (dist[i][j] > dist[i][k] + dist[k][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
            next[i][j] = next[i][k];
          }
        }
      }
    }
  }

  return { dist, next };
};
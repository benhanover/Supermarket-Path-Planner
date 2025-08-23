import { Square } from "../components/Dashboard/types";
import { buildGraph } from "./layoutGraph";
import { floydWarshall } from "./floydWarshall";

export type PathData = {
  dist: number[][];
  next: number[][];
  metadata: {
    timestamp: string;
    rowCount: number;
    colCount: number;
  };
};

/**
 * Compute path optimization data (all-pairs shortest paths) for a given layout.
 * Pure function: no side effects.
 */
export function computePathDataForLayout(layout: Square[][]): PathData {
  const graph = buildGraph(layout);
  const { dist, next } = floydWarshall(graph);
  return {
    dist,
    next,
    metadata: {
      timestamp: new Date().toISOString(),
      rowCount: layout.length,
      colCount: layout[0]?.length ?? 0,
    },
  };
}

// src/components/Dashboard/DashboardContext/dashboardActions.ts
import { SquareType, Square, Layout } from "../types";
import { EditableAction } from "../types";
import { Dispatch, SetStateAction } from "react";

/**
 * Handles clicking on a square in the layout
 */
export const handleSquareClick = (
  row: number,
  col: number,
  trigger: "mouse_down" | "mouse_enter",
  layout: Layout,
  setLayout: Dispatch<SetStateAction<Layout | null>>,
  activeAction: EditableAction,
  selectedType: SquareType,
  setSelectedSquare: Dispatch<SetStateAction<Square | null>>,
  setEditMode: Dispatch<SetStateAction<boolean>>,
  setActiveTab: Dispatch<
    SetStateAction<"layout" | "products" | "product_square">
  >
) => {
  if (!layout) return;

  const clickedSquare = layout.grid[row][col];

  if (activeAction === EditableAction.ModifyLayout) {
    setLayout((prevLayout) => {
      if (!prevLayout) return null;
      const newGrid = prevLayout.grid.map((r) =>
        r.map((square) =>
          square.row === row && square.col === col
            ? { ...square, type: selectedType }
            : square
        )
      );
      return { ...prevLayout, grid: newGrid };
    });
  } else if (
    activeAction === EditableAction.EditProducts &&
    clickedSquare.type === "products" &&
    trigger === "mouse_down"
  ) {
    setSelectedSquare(clickedSquare);
    setActiveTab("product_square");
  }
};

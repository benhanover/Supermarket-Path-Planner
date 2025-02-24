// src/context/dashboard/dashboardActions.ts
import { SquareType, Square, Supermarket } from "../types";
import { EditableAction } from "../types";
import { Dispatch, SetStateAction } from "react";

export const handleSquareClick = (
  row: number,
  col: number,
  trigger: "mouse_down" | "mouse_enter",
  supermarket: Supermarket | null,
  setSupermarket: Dispatch<SetStateAction<Supermarket | null>>,
  activeAction: EditableAction,
  selectedType: SquareType,
  setSelectedSquare: Dispatch<SetStateAction<Square | null>>,
  setActiveTab: Dispatch<
    SetStateAction<"layout" | "products" | "product_square">
  >
) => {
  if (!supermarket) return;

  const clickedSquare = supermarket.layout.grid[row][col];

  if (activeAction === EditableAction.ModifyLayout) {
    setSupermarket((prevSupermarket) => {
      if (!prevSupermarket) return prevSupermarket;

      const updatedGrid = prevSupermarket.layout.grid.map((r) =>
        r.map((square) =>
          square.row === row && square.col === col
            ? { ...square, type: selectedType }
            : square
        )
      );

      return {
        ...prevSupermarket,
        layout: { ...prevSupermarket.layout, grid: updatedGrid },
      };
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

export const createInitialSupermarket = (user: any): Supermarket => ({
  id: user.sub,
  name: user.supermarketName,
  address: user.address,
  layout: {
    rows: user.layoutRows,
    cols: user.layoutCols,
    grid: Array.from({ length: user.layoutRows }, (_, row) =>
      Array.from({ length: user.layoutCols }, (_, col) => ({
        type: "empty",
        products: [],
        row,
        col,
      }))
    ),
  },
  products: [],
});

// src/components/Dashboard/DashboardContext/dashboardActions.ts
import { SquareType, Square, Supermarket } from "../types";
import { EditableAction } from "../types";
import { Dispatch, SetStateAction } from "react";

/**
 * Handles clicking on a square in the layout
 */
export const handleSquareClick = (
  row: number,
  col: number,
  trigger: "mouse_down" | "mouse_enter",
  supermarket: Supermarket,
  setSupermarket: Dispatch<SetStateAction<Supermarket | null>>,
  activeAction: EditableAction,
  selectedType: SquareType,
  setSelectedSquare: Dispatch<SetStateAction<Square | null>>,
  setActiveTab: Dispatch<
    SetStateAction<"layout" | "products" | "product_square">
  >
) => {
  if (!supermarket) {
    console.error("Supermarket is null in handleSquareClick");
    return;
  }

  console.log(
    `Square clicked: row=${row}, col=${col}, trigger=${trigger}, activeAction=${activeAction}, selectedType=${selectedType}`
  );

  // Ensure layout exists and has the right dimensions
  if (
    !supermarket.layout ||
    row >= supermarket.layout.length ||
    col >= supermarket.layout[0].length
  ) {
    console.error("Invalid layout dimensions or layout is undefined");
    return;
  }

  const clickedSquare = supermarket.layout[row][col];
  console.log("Current square type:", clickedSquare.type);

  if (activeAction === EditableAction.ModifyLayout) {
    console.log("Modifying layout - changing square type to:", selectedType);

    // Only update if the type is actually changing
    if (clickedSquare.type === selectedType) {
      console.log("Square already has the selected type. No change needed.");
      return;
    }

    setSupermarket((prevSupermarket) => {
      if (!prevSupermarket) {
        console.error("Previous supermarket is null in setSupermarket");
        return null;
      }

      console.log("Creating new layout with updated square type");

      // Create a completely new layout array by deep copying the old one
      const newLayout = prevSupermarket.layout.map((rowArray) =>
        rowArray.map((square) => ({ ...square }))
      );

      // Update the specific square
      newLayout[row][col] = {
        ...newLayout[row][col],
        type: selectedType,
      };

      console.log("New square type:", newLayout[row][col].type);

      // Create a new supermarket object with the new layout
      const newSupermarket = {
        ...prevSupermarket,
        layout: newLayout,
      };

      console.log("Returning updated supermarket");
      return newSupermarket;
    });
  } else if (
    activeAction === EditableAction.EditProducts &&
    clickedSquare.type === "products" &&
    trigger === "mouse_down"
  ) {
    console.log(
      "Edit products - setting selected square and switching to product square tab"
    );
    setSelectedSquare(clickedSquare);
    setActiveTab("product_square");
  }
};

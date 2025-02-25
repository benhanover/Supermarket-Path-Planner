// src/context/dashboard/dashboardActions.ts
import { SquareType, Square, Supermarket, Layout } from "../types";
import { EditableAction } from "../types";
import { Dispatch, SetStateAction } from "react";
import { generateClient } from "aws-amplify/data";
import { Schema } from "../../../../amplify/data/resource";

// Define enhanced layout type with grid property
interface EnhancedLayout extends Layout {
  grid: Square[][];
}

// Define enhanced supermarket with enhanced layout
interface EnhancedSupermarket extends Omit<Supermarket, "layout"> {
  layout: EnhancedLayout;
}

// Try to generate the client for database operations
let client;
try {
  client = generateClient<Schema>();
} catch (error) {
  console.error("Error generating Amplify client:", error);
  client = null;
}

/**
 * Updates a square in the database when its type changes
 */
const updateSquareInDatabase = async (
  squareId: string,
  type: SquareType
): Promise<boolean> => {
  if (!client?.models?.Square?.update) {
    console.error("Square update API not available");
    return false;
  }

  try {
    console.log(`Updating square ${squareId} to type ${type} in database...`);
    const response = await client.models.Square.update({
      id: squareId,
      type,
    });

    if (response.data) {
      console.log("Square successfully updated in database:", response.data);
      return true;
    } else {
      console.error("Failed to update square, no data returned");
      return false;
    }
  } catch (error) {
    console.error("Error updating square in database:", error);
    return false;
  }
};

/**
 * Creates a new square in the database if it doesn't exist yet
 */
const createSquareInDatabase = async (
  square: Square
): Promise<string | null> => {
  if (!client?.models?.Square?.create) {
    console.error("Square create API not available");
    return null;
  }

  try {
    console.log(
      `Creating new square at row ${square.row}, col ${square.col} in database...`
    );
    const response = await client.models.Square.create({
      type: square.type,
      row: square.row,
      col: square.col,
      layoutID: square.layoutID,
    });

    if (response.data) {
      console.log("Square successfully created in database:", response.data);
      return response.data.id;
    } else {
      console.error("Failed to create square, no data returned");
      return null;
    }
  } catch (error) {
    console.error("Error creating square in database:", error);
    return null;
  }
};

export const handleSquareClick = async (
  row: number,
  col: number,
  trigger: "mouse_down" | "mouse_enter",
  supermarket: EnhancedSupermarket | null,
  setSupermarket: Dispatch<SetStateAction<EnhancedSupermarket | null>>,
  activeAction: EditableAction,
  selectedType: SquareType,
  setSelectedSquare: Dispatch<SetStateAction<Square | null>>,
  setActiveTab: Dispatch<
    SetStateAction<"layout" | "products" | "product_square">
  >
) => {
  if (!supermarket || !supermarket.layout || !supermarket.layout.grid) {
    console.error("Invalid supermarket data");
    return;
  }

  const clickedSquare = supermarket.layout.grid[row][col];

  if (activeAction === EditableAction.ModifyLayout) {
    // Don't update if the type hasn't changed
    if (clickedSquare.type === selectedType) {
      return;
    }

    // Check if this is a locally generated ID or a real database ID
    let squareId = clickedSquare.id;
    let isNewSquare =
      squareId.startsWith("temp-") || squareId.startsWith("local-");

    // If it's a real database square, update it
    if (!isNewSquare) {
      // We'll try to update the database first
      const updateSuccess = await updateSquareInDatabase(
        squareId,
        selectedType
      );

      // If update failed, log a warning but still update the UI
      if (!updateSuccess) {
        console.warn(
          "Could not update square in database. Updates will not persist after refresh."
        );
      }
    } else {
      // This is a new square not yet in the database, create it
      const newId = await createSquareInDatabase({
        ...clickedSquare,
        type: selectedType,
      });

      if (newId) {
        // If we successfully created it, update the id in our state
        squareId = newId;
      } else {
        console.warn(
          "Could not create square in database. Updates will not persist after refresh."
        );
      }
    }

    // Update our local state regardless of API success (for responsive UI)
    setSupermarket((prevSupermarket) => {
      if (
        !prevSupermarket ||
        !prevSupermarket.layout ||
        !prevSupermarket.layout.grid
      ) {
        return prevSupermarket;
      }

      const updatedGrid = prevSupermarket.layout.grid.map((r) =>
        r.map((square) =>
          square.row === row && square.col === col
            ? {
                ...square,
                id: squareId, // Use the possibly updated ID
                type: selectedType,
              }
            : square
        )
      );

      return {
        ...prevSupermarket,
        layout: {
          ...prevSupermarket.layout,
          grid: updatedGrid,
        },
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

export const createInitialSupermarket = (user: any): EnhancedSupermarket => {
  const rows = user.layoutRows || 20;
  const cols = user.layoutCols || 30;

  return {
    id: user.sub,
    name: user.supermarketName || "My Supermarket",
    address: user.address || "Default Address",
    layoutId: `local-layout-${Date.now()}`,
    owner: user.sub,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    products: [],
    layout: {
      id: `local-layout-${Date.now()}`,
      rows: rows,
      cols: cols,
      supermarketID: user.sub,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      grid: Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => ({
          id: `local-square-${row}-${col}-${Date.now()}`,
          type: "empty" as SquareType,
          row,
          col,
          layoutID: `local-layout-${Date.now()}`,
          products: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }))
      ),
    },
  };
};

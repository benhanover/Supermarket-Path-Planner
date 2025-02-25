// src/context/dashboard/dashboardApi.ts
import { Product, Supermarket, Layout, Square, SquareType } from "../types";
import { User } from "../../../types";
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

// Try to generate the client, but handle potential errors
let client;
try {
  client = generateClient<Schema>();
} catch (error) {
  console.error("Error generating Amplify client:", error);
  // Create a fallback client with empty methods to prevent runtime errors
  client = {
    models: {
      Supermarket: {
        list: async () => ({ data: [] }),
        create: async () => ({ data: null }),
      },
      Layout: {
        list: async () => ({ data: [] }),
        create: async () => ({ data: null }),
        get: async () => ({ data: null }),
      },
      Square: {
        list: async () => ({ data: [] }),
        create: async () => ({ data: null }),
      },
      Product: {
        list: async () => ({ data: [] }),
        create: async () => ({ data: null }),
      },
    },
  };
}

/**
 * Creates initial square grid for a layout
 */
const createInitialSquares = async (
  layoutId: string,
  rows: number,
  cols: number
): Promise<Square[][]> => {
  console.log(
    `Creating ${rows}x${cols} initial squares for layout ${layoutId}...`
  );

  // In case of client issues, we'll generate a client-side grid
  if (!client?.models?.Square?.create) {
    console.warn("Using mock squares instead of creating in database");
    return Array.from({ length: rows }, (_, row) =>
      Array.from({ length: cols }, (_, col) => ({
        id: `local-square-${row}-${col}`,
        type: "empty" as SquareType,
        row,
        col,
        layoutID: layoutId,
        products: [] as Product[],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }))
    );
  }

  const squaresToCreate = [];
  const batchSize = 25; // DynamoDB has limits on batch operations

  // Prepare squares data
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      squaresToCreate.push({
        type: "empty" as SquareType,
        row: row,
        col: col,
        layoutID: layoutId,
      });
    }
  }

  // Create squares in batches
  for (let i = 0; i < squaresToCreate.length; i += batchSize) {
    const batch = squaresToCreate.slice(i, i + batchSize);
    const promises = batch.map((square) => client.models.Square.create(square));

    try {
      await Promise.all(promises);
      console.log(
        `Created squares batch ${i / batchSize + 1}/${Math.ceil(
          squaresToCreate.length / batchSize
        )}`
      );
    } catch (error) {
      console.error(
        `Error creating squares batch ${i / batchSize + 1}:`,
        error
      );
      // Continue despite errors - we'll create a local grid later
    }
  }

  console.log(
    `Attempted to create ${squaresToCreate.length} squares for layout ${layoutId}`
  );

  // Return a grid structure
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      id: `square-${row}-${col}-${Date.now()}`,
      type: "empty" as SquareType,
      row,
      col,
      layoutID: layoutId,
      products: [] as Product[],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }))
  );
};

/**
 * Creates a supermarket for a new user or uses a local fallback if API fails
 */
export const createSupermarketForNewUser = async (
  user: User
): Promise<EnhancedSupermarket | null> => {
  if (!user?.sub) {
    console.error("User is not authenticated.");
    return null;
  }

  try {
    // Check if the user already has a supermarket
    const result = await client.models.Supermarket.list({
      filter: { owner: { eq: user.sub } },
      includes: ["layout"],
    });
    const existingSupermarkets = result.data || [];

    if (existingSupermarkets.length > 0) {
      console.log("User already has a supermarket:", existingSupermarkets[0]);
      return null;
    }

    // Create new supermarket
    const newSupermarket = await client.models.Supermarket.create({
      owner: user.sub,
      name: user.supermarketName || "My Supermarket",
      address: user.address || "Default Address",
    });

    if (!newSupermarket.data) {
      throw new Error("Failed to create supermarket");
    }

    // Create layout
    const newLayout = await client.models.Layout.create({
      rows: user.layoutRows || 20,
      cols: user.layoutCols || 30,
      supermarketID: newSupermarket.data.id,
    });

    if (!newLayout.data) {
      throw new Error("Failed to create layout");
    }

    // Create initial squares
    const squaresPromises = [];
    for (let row = 0; row < newLayout.data.rows; row++) {
      for (let col = 0; col < newLayout.data.cols; col++) {
        squaresPromises.push(
          client.models.Square.create({
            type: "empty",
            row,
            col,
            layoutID: newLayout.data.id,
          })
        );
      }
    }

    // Create squares
    await Promise.all(squaresPromises);

    // Prepare enhanced supermarket
    return {
      ...newSupermarket.data,
      layout: {
        ...newLayout.data,
        grid: Array.from({ length: newLayout.data.rows }, (_, row) =>
          Array.from({ length: newLayout.data.cols }, (_, col) => ({
            id: `local-square-${row}-${col}`,
            type: "empty",
            row,
            col,
            layoutID: newLayout.data.id,
            products: [],
          }))
        ),
      },
      products: [],
    };
  } catch (error) {
    console.error("Error in createSupermarketForNewUser:", error);
    return null;
  }
};

/**
 * Fetches a supermarket from DynamoDB or creates one if it doesn't exist
 * Falls back to local data if API fails
 */
// Modify the initializeSupermarket function in dashboardApi.ts
export const initializeSupermarket = async (
  user: User | null,
  supermarket: Supermarket | null,
  setSupermarket: (supermarket: EnhancedSupermarket | null) => void,
  setLoading: (loading: boolean) => void
) => {
  if (!user?.sub) {
    setLoading(false);
    return;
  }

  setLoading(true);
  try {
    console.log("Initializing supermarket for user:", user.sub);

    // Check if client is properly initialized
    if (!client?.models?.Supermarket?.list) {
      throw new Error("Amplify client is not properly initialized");
    }

    // Fetch supermarket owned by the logged-in user, including its layout
    const result = await client.models.Supermarket.list({
      filter: { owner: { eq: user.sub } },
      includes: ["layout"], // Include the related layout
    });
    const currentSupermarket = (result.data || [])[0];

    if (!currentSupermarket) {
      console.log("No supermarket found, creating one...");
      const newSupermarket = await createSupermarketForNewUser(user);
      setSupermarket(newSupermarket);
      setLoading(false);
      return;
    }

    // If supermarket exists but has no layout, create one
    if (!currentSupermarket.layout) {
      console.log("Creating layout for existing supermarket...");
      const newLayout = await client.models.Layout.create({
        rows: user.layoutRows || 20,
        cols: user.layoutCols || 30,
        supermarketID: currentSupermarket.id,
      });

      if (!newLayout.data) {
        throw new Error("Failed to create layout");
      }

      // Fetch squares for the new layout
      const squaresPromises = [];
      for (let row = 0; row < newLayout.data.rows; row++) {
        for (let col = 0; col < newLayout.data.cols; col++) {
          squaresPromises.push(
            client.models.Square.create({
              type: "empty",
              row: row,
              col: col,
              layoutID: newLayout.data.id,
            })
          );
        }
      }

      // Create initial squares
      await Promise.all(squaresPromises);
    }

    // Fetch layout and squares
    const layoutResult = await client.models.Layout.list({
      filter: { supermarketID: { eq: currentSupermarket.id } },
      includes: ["squares"],
    });
    const layout = layoutResult.data?.[0];

    if (!layout) {
      throw new Error("No layout found for supermarket");
    }

    // Fetch products
    const productsResult = await client.models.Product.list({
      filter: { supermarketID: { eq: currentSupermarket.id } },
    });
    const products = productsResult.data || [];

    // Safely get squares and handle potential issues
    const squares = Array.isArray(layout.squares)
      ? layout.squares
      : layout.squares?.items || [];

    // Create grid with squares and their products
    const grid = Array.from({ length: layout.rows }, (_, row) =>
      Array.from({ length: layout.cols }, (_, col) => {
        // Safely find the square
        const square = squares.find((s: any) => s.row === row && s.col === col);

        // Find products for this square
        const squareProducts = products.filter(
          (p: any) => p.squareID === square?.id
        );

        return {
          id: square?.id || `temp-${row}-${col}`,
          type: square?.type || "empty",
          row,
          col,
          layoutID: layout.id,
          products: squareProducts,
        };
      })
    );

    // Create enhanced supermarket
    const enhancedSupermarket: EnhancedSupermarket = {
      ...currentSupermarket,
      layout: {
        ...layout,
        grid,
      },
      products,
    };

    setSupermarket(enhancedSupermarket);
  } catch (error) {
    console.error("Error initializing supermarket:", error);

    // Fallback to local supermarket creation
    if (user) {
      const fallbackSupermarket = await createSupermarketForNewUser(user);
      setSupermarket(fallbackSupermarket);
    } else {
      setSupermarket(null);
    }
  } finally {
    setLoading(false);
  }
};

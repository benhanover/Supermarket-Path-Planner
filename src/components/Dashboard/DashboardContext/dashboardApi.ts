// src/components/Dashboard/DashboardContext/dashboardApi.ts
import { Product, Supermarket, Square } from "../types";
import { Dispatch, SetStateAction } from "react";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../../../../amplify/data/resource";

const client = generateClient<Schema>();

type SetErrorFunction = (
  error: { message: string; source: string } | null
) => void;
type SetIsSavingFunction = Dispatch<SetStateAction<boolean>>;
type SetSelectedSquareFunction = Dispatch<SetStateAction<Square | null>>;

/**
 * Saves the supermarket layout to the database
 */
export const saveLayout = async (
  supermarket: Supermarket | null,
  layoutToSave: Square[][] | undefined,
  setError: SetErrorFunction,
  setIsSaving: SetIsSavingFunction
) => {
  if (!supermarket) return;

  try {
    setError(null);
    setIsSaving(true);

    // Use the provided layout parameter if available, otherwise use the current state
    const layoutData = layoutToSave || supermarket.layout;
    // Format the layout data as a string for storage
    const layoutString = JSON.stringify(layoutData);
    console.log("Saving layout:", layoutString.substring(0, 100) + "...");

    if (supermarket.id) {
      // Update the existing supermarket
      await client.models.Supermarket.update({
        id: supermarket.id,
        layout: layoutString,
      });
    } else {
      // Create a new supermarket if we don't have an ID
      console.log("no supermarket found??");
    }

    // Keep the saving indicator visible briefly so users can see it worked
    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  } catch (error) {
    setIsSaving(false);
    handleApiError(error, "saveLayout", setError);
    throw error;
  }
};

/**
 * Adds a product to the database
 */
export const addProduct = async (
  product: Omit<Product, "id">,
  supermarket: Supermarket | null,
  saveLayoutFunction: () => Promise<void>,
  setSupermarket: Dispatch<SetStateAction<Supermarket | null>>,
  setError: SetErrorFunction,
  setIsSaving: SetIsSavingFunction
) => {
  if (!supermarket?.id) {
    // If we don't have a supermarket ID yet, create the supermarket first
    try {
      await saveLayoutFunction();
    } catch (error) {
      handleApiError(error, "addProduct (saveLayout)", setError);
      throw error;
    }

    // Check again after saving layout
    if (!supermarket?.id) {
      const error = new Error("Failed to create supermarket");
      handleApiError(error, "addProduct", setError);
      throw error;
    }
  }

  try {
    setError(null);
    setIsSaving(true);

    console.log("Creating product in database:", product.title);

    // Create the product in the database with proper typing
    const response = await client.models.Product.create({
      title: product.title,
      price: product.price,
      category: product.category || "uncategorized",
      description: product.description || "",
      image: product.image || "",
      supermarketID: supermarket.id,
    });
    const newProduct = response.data;

    console.log("Product created with IDdd:", newProduct);

    // Format product for local state
    if (!newProduct?.id) {
      throw new Error("Failed to create product");
    }
    const formattedProduct: Product = {
      ...newProduct,
      id: newProduct.id,
    };

    // Update the local state with the new product
    setSupermarket((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        products: [...prev.products, formattedProduct],
      };
    });

    setTimeout(() => {
      setIsSaving(false);
    }, 500);

    return newProduct?.id;
  } catch (error) {
    setIsSaving(false);
    handleApiError(error, "addProduct", setError);
    throw error;
  }
};

/**
 * Updates a product in the database
 */
export const updateProductData = async (
  product: Product,
  supermarket: Supermarket | null,
  setSupermarket: Dispatch<SetStateAction<Supermarket | null>>,
  setSelectedSquare: SetSelectedSquareFunction,
  selectedSquare: Square | null,
  setError: SetErrorFunction,
  setIsSaving: SetIsSavingFunction
) => {
  if (!supermarket?.id) {
    const error = new Error("No supermarket ID for product update");
    handleApiError(error, "updateProductData", setError);
    throw error;
  }

  try {
    setError(null);
    setIsSaving(true);

    console.log("Updating product in database:", product.id);

    // Update the product in the database
    await client.models.Product.update({
      id: product.id,
      title: product.title,
      price: product.price,
      category: product.category || "uncategorized",
      description: product.description || "",
      image: product.image || "",
      supermarketID: supermarket.id,
    });

    // Update local state
    setSupermarket((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        products: prev.products.map((p) => (p.id === product.id ? product : p)),
        // We don't need to update anything in the layout since we're using IDs now
        // The actual product data is only stored in the products array
      };
    });

    // Update selected square if it contains this product (no need to update, just preserve the reference)
    if (selectedSquare && selectedSquare.productIds.includes(product.id)) {
      setSelectedSquare({ ...selectedSquare }); // Just trigger a re-render by creating a new object
    }

    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  } catch (error) {
    setIsSaving(false);
    handleApiError(error, "updateProductData", setError);
    throw error;
  }
};

/**
 * Removes a product from the database
 */
export const removeProduct = async (
  productId: string,
  setSupermarket: Dispatch<SetStateAction<Supermarket | null>>,
  setSelectedSquare: SetSelectedSquareFunction,
  selectedSquare: Square | null,
  setError: SetErrorFunction,
  setIsSaving: SetIsSavingFunction
) => {
  try {
    setError(null);
    setIsSaving(true);

    console.log("Removing product from database:", productId);

    // Delete the product from the database
    await client.models.Product.delete({ id: productId });

    // Update local state
    setSupermarket((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        products: prev.products.filter((p) => p.id !== productId),
        // Update the layout to remove the product ID from any square that has it
        layout: prev.layout.map((row) =>
          row.map((square) => ({
            ...square,
            productIds: square.productIds.filter((id) => id !== productId),
          }))
        ),
      };
    });

    // Update selected square if it contains this product
    if (selectedSquare && selectedSquare.productIds.includes(productId)) {
      const updatedProductIds = selectedSquare.productIds.filter(
        (id) => id !== productId
      );
      setSelectedSquare({ ...selectedSquare, productIds: updatedProductIds });
    }

    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  } catch (error) {
    setIsSaving(false);
    handleApiError(error, "removeProduct", setError);
    throw error;
  }
};

/**
 * Helper function to handle API errors
 */
const handleApiError = (
  error: unknown,
  source: string,
  setError: SetErrorFunction
) => {
  console.error(`Error in ${source}:`, error);
  let message = "An unexpected error occurred";

  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  } else if (error && typeof error === "object" && "message" in error) {
    message = String((error as any).message);
  }

  setError({ message, source });
};

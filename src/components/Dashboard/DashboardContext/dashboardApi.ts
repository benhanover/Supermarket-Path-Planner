// src/components/Dashboard/DashboardContext/dashboardApi.ts
import axios from "axios";
import { Product, Supermarket } from "../types";
import { Dispatch, SetStateAction } from "react";

/**
 * Fetches products from the API
 */
export const fetchProducts = async (
  setSupermarket: Dispatch<SetStateAction<Supermarket | null>>,
  setLoading: Dispatch<SetStateAction<boolean>>
) => {
  setLoading(true);
  try {
    const response = await axios.get<Product[]>(
      "https://fakestoreapi.com/products"
    );

    setSupermarket((currentSupermarket) => {
      if (!currentSupermarket) return null;
      return {
        ...currentSupermarket,
        products: response.data,
      };
    });
  } catch (error) {
    console.error("Error fetching products:", error);
  } finally {
    setLoading(false);
  }
};

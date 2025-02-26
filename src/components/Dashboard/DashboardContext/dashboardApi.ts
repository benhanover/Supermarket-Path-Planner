// src/components/Dashboard/DashboardContext/dashboardApi.ts
import axios from "axios";
import { Product } from "../types";
import { Dispatch, SetStateAction } from "react";

/**
 * Fetches products from the API
 */
export const fetchProducts = async (
  setProducts: Dispatch<SetStateAction<Product[]>>,
  setLoading: Dispatch<SetStateAction<boolean>>
) => {
  setLoading(true);
  try {
    const response = await axios.get<Product[]>(
      "https://fakestoreapi.com/products"
    );
    setProducts(response.data);
  } catch (error) {
    console.error("Error fetching products:", error);
  } finally {
    setLoading(false);
  }
};

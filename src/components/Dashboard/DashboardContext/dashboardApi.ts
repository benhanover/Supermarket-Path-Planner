// src/context/dashboard/dashboardApi.ts
import axios from "axios";
import { Product, Supermarket } from "../types";
import { User } from "../../../types";
import { Dispatch, SetStateAction } from "react";

export const initializeSupermarket = async (
  user: User | null,
  supermarket: Supermarket | null,
  setSupermarket: Dispatch<SetStateAction<Supermarket | null>>,
  setLoading: Dispatch<SetStateAction<boolean>>
) => {
  if (!user || supermarket?.products.length) return;

  setLoading(true);
  try {
    const response = await axios.get<Product[]>(
      "https://fakestoreapi.com/products"
    );

    setSupermarket((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        products: response.data,
      };
    });
  } catch (error) {
    console.error("Error fetching products:", error);
  } finally {
    setLoading(false);
  }
};

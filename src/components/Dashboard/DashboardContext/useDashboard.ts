// src/components/Dashboard/DashboardContext/useDashboard.ts
import { useContext } from "react";
import { DashboardContext } from "./DashboardContext";

/**
 * Custom hook to use the Dashboard context
 */
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};

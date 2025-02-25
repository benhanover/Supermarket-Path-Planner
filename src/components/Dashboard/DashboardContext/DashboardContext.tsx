import { createContext, useState, useEffect, ReactNode } from "react";
import {
  SquareType,
  Square,
  Supermarket,
  DashboardContextType,
  EditableAction,
  Layout,
} from "../types";
import { useAppContext } from "../../../context/AppContext";
import {
  handleSquareClick,
  createInitialSupermarket,
} from "./dashboardActions";
import { initializeSupermarket } from "./dashboardApi";

// Define enhanced layout type with grid property
interface EnhancedLayout extends Layout {
  grid: Square[][];
}

// Define enhanced supermarket with enhanced layout
interface EnhancedSupermarket extends Omit<Supermarket, "layout"> {
  layout: EnhancedLayout;
}

// Enhanced dashboard context type
interface EnhancedDashboardContextType
  extends Omit<DashboardContextType, "supermarket" | "setSupermarket"> {
  supermarket: EnhancedSupermarket | null;
  setSupermarket: React.Dispatch<
    React.SetStateAction<EnhancedSupermarket | null>
  >;
}

// Create the context with proper export - make sure this is exported
export const DashboardContext = createContext<
  EnhancedDashboardContextType | undefined
>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: userLoading } = useAppContext();

  const [supermarket, setSupermarket] = useState<EnhancedSupermarket | null>(
    () => (user ? createInitialSupermarket(user) : null)
  );

  const [selectedType, setSelectedType] = useState<SquareType>("empty");
  const [editMode, setEditMode] = useState(false);
  const [activeAction, setActiveAction] = useState<EditableAction>(
    EditableAction.None
  );
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [activeTab, setActiveTab] = useState<
    "layout" | "products" | "product_square"
  >("layout");
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   if (user && !supermarket) {
  //     setSupermarket(createInitialSupermarket(user));
  //   }
  // }, [user, supermarket]);

  // useEffect(() => {
  //   if (user) {
  //     // Cast to any to avoid TypeScript errors during initialization
  //     // The function will properly initialize with the EnhancedSupermarket type
  //     initializeSupermarket(
  //       user,
  //       supermarket as any,
  //       setSupermarket as any,
  //       setLoading
  //     );
  //   }
  // }, [user]);
  useEffect(() => {
    if (user) {
      // If no supermarket exists, create an initial local supermarket
      if (!supermarket) {
        const initialSupermarket = createInitialSupermarket(user);
        setSupermarket(initialSupermarket);
      }

      // Always attempt to initialize from the backend
      initializeSupermarket(
        user,
        supermarket as any,
        setSupermarket as any,
        setLoading
      );
    }
  }, [user]);

  if (userLoading) {
    return <div className="text-center text-gray-600 text-lg">Loading...</div>;
  }

  return (
    <DashboardContext.Provider
      value={{
        supermarket,
        setSupermarket,
        selectedType,
        setSelectedType,
        editMode,
        setEditMode,
        activeAction,
        setActiveAction,
        handleSquareClick: (row, col, trigger) =>
          handleSquareClick(
            row,
            col,
            trigger,
            supermarket as EnhancedSupermarket,
            setSupermarket,
            activeAction,
            selectedType,
            setSelectedSquare,
            setActiveTab
          ),
        selectedSquare,
        setSelectedSquare,
        activeTab,
        setActiveTab,
        loading,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

// Default export for the main provider component
export default DashboardProvider;

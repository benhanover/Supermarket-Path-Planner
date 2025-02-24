import { createContext, useState, useEffect, ReactNode } from "react";
import {
  SquareType,
  Square,
  Supermarket,
  DashboardContextType,
  EditableAction,
} from "../types";
import { useAppContext } from "../../../context/AppContext";
import {
  handleSquareClick,
  createInitialSupermarket,
} from "./dashboardActions";
import { initializeSupermarket } from "./dashboardApi";

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: userLoading } = useAppContext();

  const [supermarket, setSupermarket] = useState<Supermarket | null>(() =>
    user ? createInitialSupermarket(user) : null
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

  useEffect(() => {
    if (user && !supermarket) {
      setSupermarket(createInitialSupermarket(user));
    }
  }, [user, supermarket]);

  useEffect(() => {
    if (supermarket && !supermarket.products.length) {
      initializeSupermarket(user, supermarket, setSupermarket, setLoading);
    }
  }, [supermarket, user]);

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
            supermarket,
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

export default DashboardContext;

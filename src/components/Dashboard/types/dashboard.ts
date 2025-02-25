// Add this to your types/dashboard.ts file

import { Dispatch, SetStateAction } from "react";
import { Supermarket, SquareType, Square, Layout } from "./index";

// Enhanced Layout with grid property
export interface EnhancedLayout extends Layout {
  grid: Square[][];
}

// Enhanced Supermarket with enhanced layout
export interface EnhancedSupermarket extends Omit<Supermarket, "layout"> {
  layout: EnhancedLayout;
}

// Enhanced Dashboard Context Type
export interface EnhancedDashboardContextType
  extends Omit<DashboardContextType, "supermarket" | "setSupermarket"> {
  supermarket: EnhancedSupermarket | null;
  setSupermarket: Dispatch<SetStateAction<EnhancedSupermarket | null>>;
}

export enum EditableAction {
  None = "none",
  ModifyLayout = "modify_layout",
  EditProducts = "edit_products",
  ChangeLayoutSize = "change_layout_size",
}

export interface DashboardContextType {
  supermarket: Supermarket | null;
  setSupermarket: Dispatch<SetStateAction<Supermarket | null>>;
  selectedType: SquareType;
  setSelectedType: (type: SquareType) => void;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  activeAction: EditableAction;
  setActiveAction: (action: EditableAction) => void;
  handleSquareClick: (
    row: number,
    col: number,
    trigger: "mouse_down" | "mouse_enter"
  ) => void;
  selectedSquare: Square | null;
  setSelectedSquare: Dispatch<SetStateAction<Square | null>>;
  activeTab: "layout" | "products" | "product_square";
  setActiveTab: Dispatch<
    SetStateAction<"layout" | "products" | "product_square">
  >;
  loading: boolean;
}

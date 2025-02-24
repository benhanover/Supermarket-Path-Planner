import { Dispatch, SetStateAction } from "react";
import { Supermarket, SquareType, Square } from "./index";

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

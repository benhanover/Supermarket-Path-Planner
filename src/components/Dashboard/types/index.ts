import type { Square, SquareType, Product, Supermarket } from "./base";
export enum EditableAction {
  None = "none",
  ModifyLayout = "modify_layout",
  EditProducts = "edit_products",
  ChangeLayoutSize = "change_layout_size",
}

export type { Square, SquareType, Product, Supermarket };

// src/__tests__/components/Dashboard/Square.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import Square from "../../../components/Dashboard/Layout/Square";

// Mock the useDashboard hook
jest.mock(
  "../../../components/Dashboard/DashboardContext/useDashboard",
  () => ({
    useDashboard: jest.fn().mockReturnValue({
      activeAction: "modify_layout",
    }),
  })
);

describe("Square Component", () => {
  const mockOnMouseDown = jest.fn();
  const mockOnMouseEnter = jest.fn();
  const square = {
    type: "empty" as const,
    productIds: [],
    row: 1,
    col: 2,
  };

  beforeEach(() => {
    mockOnMouseDown.mockReset();
    mockOnMouseEnter.mockReset();
  });

  it("renders with the correct style based on type", () => {
    render(
      <Square
        square={square}
        onMouseDown={mockOnMouseDown}
        onMouseEnter={mockOnMouseEnter}
      />
    );

    const squareElement = screen.getByRole("presentation", { hidden: true });
    expect(squareElement).toHaveClass("bg-gray-200"); // Classes for empty squares
    expect(squareElement).toHaveAttribute("data-square-type", "empty");
    expect(squareElement).toHaveAttribute("data-position", "1,2");
  });

  it("calls onMouseDown when clicked", () => {
    render(
      <Square
        square={square}
        onMouseDown={mockOnMouseDown}
        onMouseEnter={mockOnMouseEnter}
      />
    );

    fireEvent.mouseDown(screen.getByRole("presentation", { hidden: true }));
    expect(mockOnMouseDown).toHaveBeenCalledWith(1, 2);
  });

  it("calls onMouseEnter when mouse enters", () => {
    render(
      <Square
        square={square}
        onMouseDown={mockOnMouseDown}
        onMouseEnter={mockOnMouseEnter}
      />
    );

    fireEvent.mouseEnter(screen.getByRole("presentation", { hidden: true }));
    expect(mockOnMouseEnter).toHaveBeenCalledWith(1, 2);
  });

  it("renders differently for different square types", () => {
    // Test with products type
    const productsSquare = { ...square, type: "products" as const };
    const { rerender } = render(
      <Square
        square={productsSquare}
        onMouseDown={mockOnMouseDown}
        onMouseEnter={mockOnMouseEnter}
      />
    );

    let squareElement = screen.getByRole("presentation", { hidden: true });
    expect(squareElement).toHaveClass("bg-green-500"); // Classes for products squares

    // Test with cash_register type
    const cashRegisterSquare = { ...square, type: "cash_register" as const };
    rerender(
      <Square
        square={cashRegisterSquare}
        onMouseDown={mockOnMouseDown}
        onMouseEnter={mockOnMouseEnter}
      />
    );

    squareElement = screen.getByRole("presentation", { hidden: true });
    expect(squareElement).toHaveClass("bg-yellow-500"); // Classes for cash register squares
  });
});

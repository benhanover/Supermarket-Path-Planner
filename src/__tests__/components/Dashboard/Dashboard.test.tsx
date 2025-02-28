// src/__tests__/components/Dashboard/Dashboard.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "../../../components/Dashboard/Dashboard";
import { AppProvider } from "../../../context/AppContext";

// Mock the sub-components to simplify testing
jest.mock("../../../components/Dashboard/Layout/LayoutEditor", () =>
  jest.fn(() => <div data-testid="layout-editor">Layout Editor Content</div>)
);

jest.mock("../../../components/Dashboard/Products/ProductsEditor", () =>
  jest.fn(() => (
    <div data-testid="products-editor">Products Editor Content</div>
  ))
);

jest.mock(
  "../../../components/Dashboard/Product_Square_Editor/ProductSquareEditor",
  () =>
    jest.fn(() => (
      <div data-testid="product-square-editor">
        Product Square Editor Content
      </div>
    ))
);

// Mock the useDashboard hook
jest.mock(
  "../../../components/Dashboard/DashboardContext/useDashboard",
  () => ({
    useDashboard: jest.fn().mockReturnValue({
      activeTab: "layout",
      setActiveTab: jest.fn(),
      // Add other required properties used by Dashboard
    }),
  })
);

describe("Dashboard Component", () => {
  it("renders the dashboard with tabs", () => {
    render(
      <AppProvider>
        <Dashboard />
      </AppProvider>
    );

    // Check if tabs are rendered
    expect(screen.getByText("Layout Editor")).toBeInTheDocument();
    expect(screen.getByText("Products Editor")).toBeInTheDocument();
    expect(screen.getByText("Product Square Editor")).toBeInTheDocument();

    // Check if the layout editor content is visible by default
    expect(screen.getByTestId("layout-editor")).toBeInTheDocument();

    // Products editor should be hidden initially
    expect(screen.queryByTestId("products-editor")).not.toBeVisible();
    expect(screen.queryByTestId("product-square-editor")).not.toBeVisible();
  });

  it("switches tabs when clicked", async () => {
    const {
      useDashboard,
    } = require("../../../components/Dashboard/DashboardContext/useDashboard");
    const mockSetActiveTab = jest.fn();

    // Update the mock return value for useDashboard
    useDashboard.mockReturnValue({
      activeTab: "layout",
      setActiveTab: mockSetActiveTab,
      // Other required properties
    });

    render(
      <AppProvider>
        <Dashboard />
      </AppProvider>
    );

    // Click the Products Editor tab
    await userEvent.click(screen.getByText("Products Editor"));

    // Check that setActiveTab was called with 'products'
    expect(mockSetActiveTab).toHaveBeenCalledWith("products");
  });
});

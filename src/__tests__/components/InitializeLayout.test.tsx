// src/__tests__/components/InitializeLayout.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InitializeLayout from "../../components/InitializeLayout";
import { AppProvider } from "../../context/AppContext";

// Mock generateClient and the client methods
jest.mock("aws-amplify/api", () => ({
  generateClient: jest.fn().mockReturnValue({
    models: {
      Supermarket: {
        create: jest.fn().mockResolvedValue({
          data: {
            id: "new-supermarket-id",
            owner: "test-user-id",
            name: "Test Supermarket",
            address: "Test Address",
            layout: "[]",
          },
        }),
      },
    },
  }),
}));

// Mock the useAppContext hook
jest.mock("../../context/AppContext", () => ({
  ...jest.requireActual("../../context/AppContext"),
  useAppContext: jest.fn().mockReturnValue({
    user: { userId: "test-user-id" },
    setSupermarket: jest.fn(),
  }),
}));

describe("InitializeLayout Component", () => {
  it("renders the form correctly", () => {
    render(
      <AppProvider>
        <InitializeLayout />
      </AppProvider>
    );

    expect(screen.getByText("Initialize Your Supermarket")).toBeInTheDocument();
    expect(screen.getByLabelText(/Supermarket Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Supermarket Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Number of Rows/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Number of Columns/i)).toBeInTheDocument();
    expect(screen.getByText("Initialize Supermarket")).toBeInTheDocument();
  });

  it("allows entering form data", async () => {
    render(
      <AppProvider>
        <InitializeLayout />
      </AppProvider>
    );

    // Get form inputs
    const nameInput = screen.getByLabelText(/Supermarket Name/i);
    const addressInput = screen.getByLabelText(/Supermarket Address/i);
    const rowsInput = screen.getByLabelText(/Number of Rows/i);
    const colsInput = screen.getByLabelText(/Number of Columns/i);

    // Enter form data
    await userEvent.type(nameInput, "My Supermarket");
    await userEvent.type(addressInput, "123 Main St");
    await userEvent.clear(rowsInput);
    await userEvent.type(rowsInput, "10");
    await userEvent.clear(colsInput);
    await userEvent.type(colsInput, "15");

    // Check that the inputs have the correct values
    expect(nameInput).toHaveValue("My Supermarket");
    expect(addressInput).toHaveValue("123 Main St");
    expect(rowsInput).toHaveValue(10);
    expect(colsInput).toHaveValue(15);
  });

  it("submits the form and creates a new supermarket", async () => {
    const { generateClient } = require("aws-amplify/api");
    const mockCreate = generateClient().models.Supermarket.create;
    const { useAppContext } = require("../../context/AppContext");
    const mockSetSupermarket = useAppContext().setSupermarket;

    render(
      <AppProvider>
        <InitializeLayout />
      </AppProvider>
    );

    // Fill out the form
    await userEvent.type(
      screen.getByLabelText(/Supermarket Name/i),
      "My Supermarket"
    );
    await userEvent.type(
      screen.getByLabelText(/Supermarket Address/i),
      "123 Main St"
    );

    // Submit the form
    fireEvent.click(screen.getByText("Initialize Supermarket"));

    // Wait for the API call to complete
    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled();
    });

    // Check that setSupermarket was called
    expect(mockSetSupermarket).toHaveBeenCalled();
  });
});

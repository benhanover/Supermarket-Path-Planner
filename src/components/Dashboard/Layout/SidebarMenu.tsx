import { useAppContext } from "../../../context/AppContext";
import { useDashboard } from "../DashboardContext/useDashboard";
import { EditableAction } from "../types";
import { SquareType } from "../types";
import { useState } from "react";
import { buildGraph } from "../../../utils/layoutGraph";
import { floydWarshall } from "../../../utils/floydWarshall";
import { tspNearestNeighbor } from "../../../utils/tsp_heuristic";
import { tspHeldKarp } from "../../../utils/held_karp_tsp_optimal";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import ProductsImporter from "../../ProductsImporter"; // Import the ProductsImporter component

// Square types with colors for UI
const squareTypes: { type: SquareType; color: string; label: string }[] = [
  { type: "empty", color: "bg-gray-300", label: "Empty" },
  { type: "products", color: "bg-green-300", label: "Products" },
  { type: "cash_register", color: "bg-amber-200", label: "Cash Register" },
  { type: "entrance", color: "bg-blue-400", label: "Entrance" },
  { type: "exit", color: "bg-rose-400", label: "Exit" },
];

interface SidebarMenuProps {
  closeSidebar?: () => void;
}

const SidebarMenu = ({ closeSidebar }: SidebarMenuProps) => {
  const {
    selectedType,
    setSelectedType,
    activeAction,
    setActiveAction,
    setSelectedSquare,
    saveLayout,
    activeTab,
    setActiveTab,
    setIsSaving
  } = useDashboard();
  const { supermarket, setSupermarket } = useAppContext();

  const [showSizePrompt, setShowSizePrompt] = useState(false);
  const [newRows, setNewRows] = useState<number | "">();
  const [newCols, setNewCols] = useState<number | "">();
  const [isComputingPaths, setIsComputingPaths] = useState(false);
  const [showImporter, setShowImporter] = useState(false); // New state for toggling the products importer

  // Handle tab change with optional sidebar closing for mobile
  const handleTabChange = (tab: "layout" | "products" | "product_square") => {
    setActiveTab(tab);
    if (closeSidebar) {
      closeSidebar();
    }
  };

  // Function to compute path data and save it to the database
  const computePathData = async () => {
    if (!supermarket || !supermarket.layout) return;

    try {
      setIsComputingPaths(true);

      // Build the graph from the layout
      console.log("Building graph from layout...");
      const graph = buildGraph(supermarket.layout);

      // Run Floyd-Warshall algorithm
      console.log("Running Floyd-Warshall algorithm...");
      const { dist, next } = floydWarshall(graph);

      console.log("Distance matrix:", dist);
      console.log("Next matrix:", next);

      // Create path data object
      const pathData = {
        dist,
        next,
        metadata: {
          timestamp: new Date().toISOString(),
          rowCount: supermarket.layout.length,
          colCount: supermarket.layout[0].length,
        },
      };

      console.log("Path data created successfully");

      // Update local state with path data
      setSupermarket((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          pathData,
        };
      });

      // Save path data to the database
      if (supermarket.id) {
        console.log("Saving path data to the database...");
        setIsSaving(true);

        // Import the client from your existing Amplify configuration
        const client = generateClient<Schema>();

        // Update the supermarket in the database
        await client.models.Supermarket.update({
          id: supermarket.id,
          pathData: JSON.stringify(pathData), // Convert to string for storage
        });

        console.log("Path data saved to database successfully!");

        // Keep the saving indicator visible briefly
        setTimeout(() => {
          setIsSaving(false);
        }, 500);

        alert("Path optimization data computed and saved successfully!");
      } else {
        console.error("No supermarket ID found for saving path data");
        alert("Path optimization data computed but not saved (missing supermarket ID)");
      }
    } catch (error) {
      console.error("Failed to compute or save path data:", error);
      setIsSaving(false);
      alert("Failed to process path data. Please check console for details.");
    } finally {
      setIsComputingPaths(false);
    }
  };

  // Function to confirm new layout size
  const confirmLayoutSize = async () => {
    if (!newRows || !newCols) {
      alert("Please enter valid numbers for rows and columns.");
      return;
    }

    const confirmChange = window.confirm(
      `Are you sure you want to reset the layout to ${newRows} rows and ${newCols} columns? This will erase all current data.`
    );

    if (!confirmChange) return;

    try {
      console.log("Updating layout size to Rows:", newRows, "Cols:", newCols);

      // Create the new layout
      const newLayout = Array.from({ length: Number(newRows) }, (_, row) =>
        Array.from({ length: Number(newCols) }, (_, col) => ({
          type: "empty" as const,
          productIds: [],
          row,
          col,
        }))
      );

      // Update supermarket state in AppContext
      setSupermarket((prevSupermarket) => {
        if (!prevSupermarket) return null;

        return {
          ...prevSupermarket,
          layout: newLayout,
          // Reset path data since layout changed completely
          pathData: undefined,
        };
      });

      // Save the layout to the database
      await saveLayout(newLayout);

      setShowSizePrompt(false);
      setActiveAction(EditableAction.None);
    } catch (error) {
      console.error("Failed to update layout size:", error);
    }
  };

  // Function to handle when import is complete
  const handleImportComplete = (results: { successful: number; failed: number }) => {
    console.log(`Product import completed: ${results.successful} successful, ${results.failed} failed`);
  };

  return (
    <div className="w-64 min-h-screen bg-gray-200 p-4 md:p-6 flex flex-col gap-3 shadow-lg overflow-y-auto">
      {/* Editor Selection Tabs */}
      <div className="mb-4 space-y-2">
        <h2 className="text-lg font-bold text-gray-700 mb-3">Dashboard</h2>
        <button
          className={`w-full text-left px-3 py-2 rounded-lg font-semibold transition hover:bg-blue-200 text-sm md:text-base ${activeTab === "layout" ? "bg-blue-200" : ""
            }`}
          onClick={() => handleTabChange("layout")}
        >
          🎨 Layout Editor
        </button>
        <button
          className={`w-full text-left px-3 py-2 rounded-lg font-semibold transition hover:bg-blue-200 text-sm md:text-base ${activeTab === "products" ? "bg-blue-200" : ""
            }`}
          onClick={() => handleTabChange("products")}
        >
          🛠 Products Editor
        </button>
        <button
          className={`w-full text-left px-3 py-2 rounded-lg font-semibold transition hover:bg-blue-200 text-sm md:text-base ${activeTab === "product_square" ? "bg-blue-200" : ""
            }`}
          onClick={() => handleTabChange("product_square")}
        >
          🔍 Product Square Editor
        </button>
      </div>

      {/* Import Products Section */}
      <div className="mb-4">
        <button
          onClick={() => setShowImporter(!showImporter)}
          className={`w-full px-3 py-2 rounded-lg font-semibold text-sm md:text-base transition
            ${showImporter ? "bg-indigo-700" : "bg-indigo-600 hover:bg-indigo-700"}
            text-white`}
        >
          {showImporter ? "Hide Products Importer" : "📦 Import Products"}
        </button>

        {showImporter && (
          <div className="mt-3">
            <ProductsImporter onComplete={handleImportComplete} />
          </div>
        )}
      </div>

      {/* Path Optimization Button */}
      <div className="mb-4">
        <button
          onClick={computePathData}
          disabled={isComputingPaths || !supermarket}
          className={`w-full px-3 py-2 rounded-lg font-semibold text-sm md:text-base transition
            ${isComputingPaths
              ? "bg-yellow-300 cursor-wait"
              : "bg-emerald-500 text-white hover:bg-emerald-600"
            }
            ${!supermarket ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          {isComputingPaths ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Computing Paths...
            </span>
          ) : (
            "🧭 Optimize Shopping Paths"
          )}
        </button>

        <button
          onClick={() => {
            const input = prompt(
              "Enter product square coordinates (e.g. 0,1;1,2;3,3):"
            );
            if (!input || !supermarket?.pathData) {
              alert("Invalid input or path data missing.");
              return;
            }

            const coords = input
              .split(";")
              .map((pair) => pair.trim().split(",").map(Number))
              .filter((arr) => arr.length === 2 && arr.every(Number.isFinite))
              .map(([row, col]) => ({ row, col }));

            if (coords.length === 0) {
              alert("No valid coordinates provided.");
              return;
            }

            const result = tspNearestNeighbor(
              coords,
              supermarket.pathData.dist,
              supermarket.pathData.metadata.colCount,
              coords[0] // assume starting from the first given square
            );

            console.log("TSP result:", result);
            alert(
              "TSP order:\n" +
              result.map((sq) => `(${sq.row},${sq.col})`).join(" → ")
            );
          }}
          className="w-full px-3 py-2 rounded-lg font-semibold text-sm md:text-base bg-indigo-500 text-white hover:bg-indigo-600 mt-2"
        >
          🧪 Test TSP Heuristic
        </button>

        <button
          onClick={() => {
            const input = prompt(
              "Enter:\nstart=row,col;products=row1,col1;row2,col2;..."
            );

            if (!input || !supermarket?.pathData) {
              alert("Invalid input or path data missing.");
              return;
            }

            // Parse format: start=3,2;0,0;1,2;2,3
            const parts = input.split(";");
            const startPart = parts.find((p) => p.trim().startsWith("start="));
            const productParts = parts.filter(
              (p) => !p.trim().startsWith("start=")
            );

            let startSquare: { row: number; col: number } | undefined =
              undefined;

            if (startPart) {
              const coords = startPart
                .replace("start=", "")
                .split(",")
                .map(Number);
              if (coords.length === 2 && coords.every(Number.isFinite)) {
                startSquare = { row: coords[0], col: coords[1] };
              }
            }

            const coords = productParts
              .map((pair) => pair.trim().split(",").map(Number))
              .filter((arr) => arr.length === 2 && arr.every(Number.isFinite))
              .map(([row, col]) => ({ row, col }));

            if (coords.length === 0) {
              alert("No valid product coordinates provided.");
              return;
            }

            const result = tspHeldKarp(
              coords,
              supermarket.pathData.dist,
              supermarket.pathData.metadata.colCount,
              startSquare
            );

            console.log("Optimal TSP result:", result);
            alert(
              `Start: (${startSquare?.row ?? "default"},${startSquare?.col ?? ""
              })\nOptimal TSP order:\n` +
              result.map((sq) => `(${sq.row},${sq.col})`).join(" → ")
            );
          }}
          className="w-full px-3 py-2 rounded-lg font-semibold text-sm md:text-base bg-purple-600 text-white hover:bg-purple-700 mt-2"
        >
          🧪 Test Optimal TSP (DP)
        </button>

        {supermarket?.pathData && (
          <div className="mt-2 text-xs text-gray-600">
            Path data last updated:{" "}
            {new Date(
              supermarket.pathData.metadata?.timestamp || ""
            ).toLocaleString()}
          </div>
        )}
      </div>

      {/* Show Layout Controls only when Layout tab is active */}
      {activeTab === "layout" && (
        <>
          <h2 className="text-lg font-bold text-gray-700">Layout Controls</h2>

          {/* Modify Layout Button */}
          {activeAction !== EditableAction.EditProducts &&
            activeAction !== EditableAction.ChangeLayoutSize && (
              <button
                onClick={() =>
                  setActiveAction(
                    activeAction === EditableAction.ModifyLayout
                      ? EditableAction.None
                      : EditableAction.ModifyLayout
                  )
                }
                className={`p-2 md:p-3 rounded-lg font-semibold transition w-full text-sm md:text-base
                  ${activeAction === EditableAction.ModifyLayout
                    ? "bg-blue-200 hover:bg-blue-300 text-black"
                    : "bg-gray-400 hover:bg-blue-200 text-black"
                  }`}
              >
                {activeAction === EditableAction.ModifyLayout
                  ? "Cancel Layout Edit"
                  : "Modify Layout"}
              </button>
            )}

          {/* Square Type Selection */}
          {activeAction === EditableAction.ModifyLayout && (
            <div className="flex flex-col gap-2">
              <h2 className="text-base md:text-lg font-semibold text-black">
                Select Square Type
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-1 gap-1 md:gap-2">
                {squareTypes.map(({ type, color }) => (
                  <button
                    key={type}
                    className={`p-1 md:p-2 border rounded-lg transition w-full ${color} text-black hover:opacity-75 text-xs md:text-sm
                        ${selectedType === type ? "ring-2 ring-blue-500" : ""}`}
                    onClick={() => setSelectedType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Edit Products Button */}
          {activeAction !== EditableAction.ModifyLayout &&
            activeAction !== EditableAction.ChangeLayoutSize && (
              <button
                onClick={() => {
                  if (activeAction === EditableAction.EditProducts) {
                    setActiveAction(EditableAction.None);
                    setSelectedSquare(null);
                  } else {
                    setActiveAction(EditableAction.EditProducts);
                  }
                }}
                className={`p-2 md:p-3 rounded-lg font-semibold transition w-full text-sm md:text-base
                  ${activeAction === EditableAction.EditProducts
                    ? "bg-blue-200 hover:bg-blue-300 text-black"
                    : "bg-gray-400 hover:bg-blue-200 text-black"
                  }`}
              >
                {activeAction === EditableAction.EditProducts
                  ? "Cancel Product Edit"
                  : "Edit Products"}
              </button>
            )}

          {/* Change Layout Size Button */}
          {activeAction !== EditableAction.ModifyLayout &&
            activeAction !== EditableAction.EditProducts && (
              <button
                onClick={() => {
                  setActiveAction(
                    activeAction === EditableAction.ChangeLayoutSize
                      ? EditableAction.None
                      : EditableAction.ChangeLayoutSize
                  );
                  setShowSizePrompt(true);
                }}
                className={`p-2 md:p-3 rounded-lg font-semibold transition w-full text-sm md:text-base
                  ${activeAction === EditableAction.ChangeLayoutSize
                    ? "bg-blue-200 hover:bg-blue-300 text-black"
                    : "bg-gray-400 hover:bg-blue-200 text-black"
                  }`}
              >
                {activeAction === EditableAction.ChangeLayoutSize
                  ? "Cancel Layout Change"
                  : "Change Layout Size"}
              </button>
            )}

          {/* Layout Size Input Prompt */}
          {showSizePrompt &&
            activeAction === EditableAction.ChangeLayoutSize && (
              <div className="p-3 md:p-4 border rounded-lg bg-gray-200 text-black mt-2 md:mt-4">
                <h3 className="text-sm md:text-md font-bold">
                  Enter New Layout Size
                </h3>
                <input
                  type="number"
                  placeholder="Rows"
                  className="w-full p-2 mt-2 border rounded text-sm"
                  value={newRows ?? ""}
                  onChange={(e) => setNewRows(Number(e.target.value) || "")}
                />
                <input
                  type="number"
                  placeholder="Columns"
                  className="w-full p-2 mt-2 border rounded text-sm"
                  value={newCols ?? ""}
                  onChange={(e) => setNewCols(Number(e.target.value) || "")}
                />
                <button
                  className="mt-2 md:mt-3 px-3 md:px-4 py-1 md:py-2 bg-emerald-300 text-black rounded-lg hover:bg-emerald-400 text-sm"
                  onClick={confirmLayoutSize}
                >
                  Confirm
                </button>
              </div>
            )}
        </>
      )}
    </div>
  );
};

export default SidebarMenu;

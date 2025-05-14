import { useState } from "react";
import { useDashboard } from "./Dashboard/DashboardContext/useDashboard";
import productsData from "../mocks/products.json";


interface ProductsImporterProps {
  onComplete?: (results: { successful: number; failed: number }) => void;
}

const ProductsImporter = ({ onComplete }: ProductsImporterProps) => {
  const { addProduct } = useDashboard();
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [importResults, setImportResults] = useState<{
    successful: number;
    failed: number;
    completed: boolean;
  }>({
    successful: 0,
    failed: 0,
    completed: false,
  });

  const importAllProducts = async () => {
    if (isImporting) return;

    const confirmImport = window.confirm(
      `Are you sure you want to import all ${productsData.products.length} products? This may take some time.`
    );

    if (!confirmImport) return;

    setIsImporting(true);
    setProgress(0);
    setError("");
    setImportResults({
      successful: 0,
      failed: 0,
      completed: false,
    });

    // Process in batches to avoid overwhelming the system
    const batchSize = 5;
    const totalProducts = productsData.products.length;
    let successCount = 0;
    let failCount = 0;

    try {
      for (let i = 0; i < totalProducts; i += batchSize) {
        const batch = productsData.products.slice(i, Math.min(i + batchSize, totalProducts));

        // Process each product in the batch
        const batchPromises = batch.map(async (product) => {
          try {
            await addProduct({
              title: product.title,
              price: product.price,
              category: product.category || "Uncategorized",
              description: product.description || "",
              image: product.image || ""
            });
            return { success: true };
          } catch (error) {
            console.error(`Failed to import product ${product.title}:`, error);
            return { success: false };
          }
        });

        // Wait for all products in the batch to be processed
        const results = await Promise.all(batchPromises);

        // Count successes and failures
        results.forEach(result => {
          if (result.success) {
            successCount++;
          } else {
            failCount++;
          }
        });

        // Update progress
        const currentProgress = Math.round(((i + batch.length) / totalProducts) * 100);
        setProgress(currentProgress);

        // Update results
        setImportResults({
          successful: successCount,
          failed: failCount,
          completed: false,
        });

        // Small delay between batches to prevent overwhelming the system
        if (i + batchSize < totalProducts) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }

      // Finalize import
      setImportResults({
        successful: successCount,
        failed: failCount,
        completed: true,
      });

      if (onComplete) {
        onComplete({
          successful: successCount,
          failed: failCount,
        });
      }
    } catch (error) {
      console.error("Error during product import:", error);
      setError("An unexpected error occurred during import. Please try again.");
    } finally {
      setIsImporting(false);
    }
  };

  const resetImport = () => {
    setImportResults({
      successful: 0,
      failed: 0,
      completed: false,
    });
    setProgress(0);
    setError("");
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Products Importer</h2>

      {!importResults.completed ? (
        <>
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              This will import {productsData.products.length} products from the products.json file into your store.
            </p>

            {isImporting && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500">
                  Progress: {progress}% ({importResults.successful} imported, {importResults.failed} failed)
                </p>
              </div>
            )}

            {error && (
              <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              onClick={importAllProducts}
              disabled={isImporting}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${isImporting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {isImporting ? (
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
                  Importing Products...
                </span>
              ) : (
                "Import All Products"
              )}
            </button>
          </div>
        </>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className={`text-center p-3 mb-4 rounded-md ${importResults.failed > 0 ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
            }`}>
            <p className="font-bold text-lg">Import Complete</p>
            <p>
              Successfully imported {importResults.successful} products
              {importResults.failed > 0 && `, ${importResults.failed} failed`}.
            </p>
          </div>

          <button
            onClick={resetImport}
            className="w-full py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Start New Import
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsImporter;
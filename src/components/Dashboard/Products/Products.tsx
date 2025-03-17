import { useState, useMemo } from "react";
import { useAppContext } from "../../../context/AppContext";
import { Product } from "../types";

interface ProductsProps {
  searchTerm: string;
  renderProduct?: (product: Product) => JSX.Element;
}

const Products = ({ searchTerm, renderProduct }: ProductsProps) => {
  const { supermarket, loading } = useAppContext();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!supermarket) return [];
    return supermarket.products.filter(
      (product) =>
        product?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product?.category &&
          product.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product?.description &&
          product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [supermarket, searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return filteredProducts.slice(startIndex, startIndex + productsPerPage);
  }, [filteredProducts, currentPage]);

  // Reset to first page when search changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading || !supermarket) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {searchTerm
          ? "No products match your search criteria"
          : "No products available. Add some products to get started!"}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        {paginatedProducts.map((product) =>
          renderProduct ? (
            renderProduct(product)
          ) : (
            <div key={product.id} className="p-4 border rounded-lg shadow-sm">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-32 object-cover mb-2 rounded"
              />
              <h3
                className="text-sm font-semibold truncate"
                title={product.title}
              >
                {product.title}
              </h3>
              <p className="text-gray-500">${product.price.toFixed(2)}</p>
              {product.category && (
                <span className="text-xs bg-gray-200 rounded-full px-2 py-1 mt-1 inline-block">
                  {product.category}
                </span>
              )}
            </div>
          )
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((page) => Math.min(page + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;

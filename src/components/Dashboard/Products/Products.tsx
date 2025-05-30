import { useState, useMemo, useEffect } from "react";
import { useAppContext } from "../../../context/AppContext";
import { Product } from "../types";

interface ProductsProps {
  searchTerm: string;
  renderProduct?: (product: Product) => JSX.Element;
}

const Products = ({ searchTerm, renderProduct }: ProductsProps) => {
  const { supermarket, loading } = useAppContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (productId: string) => {
    setImgErrors(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setProductsPerPage(6);
      } else if (window.innerWidth < 1024) {
        setProductsPerPage(8);
      } else {
        setProductsPerPage(12);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredProducts = useMemo(() => {
    if (!supermarket) return [];
    return supermarket.products.filter(
      (product) =>
        product?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [supermarket, searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return filteredProducts.slice(startIndex, startIndex + productsPerPage);
  }, [filteredProducts, currentPage, productsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading || !supermarket) {
    return (
      <div className="flex justify-center items-center h-24 md:h-32">
        <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-4 md:py-8 text-gray-500 text-sm md:text-base">
        {searchTerm
          ? "No products match your search criteria"
          : "No products available. Add some products to get started!"}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 mb-4">
        {paginatedProducts.map((product) => {
          const imageUrl =
            imgErrors[product.id] || !product.image?.startsWith("http")
              ? "/assets/product-placeholder.png"
              : product.image;

          return renderProduct ? (
            renderProduct(product)
          ) : (
            <div key={product.id} className="p-2 md:p-4 border rounded-lg shadow-sm">
              <img
                src={imageUrl}
                alt={product.title}
                className="w-full h-16 md:h-32 object-cover mb-1 md:mb-2 rounded"
                onError={() => handleImageError(product.id)}
              />
              <h3
                className="text-xs md:text-sm font-semibold truncate"
                title={product.title}
              >
                {product.title}
              </h3>
              <p className="text-xs md:text-sm text-gray-500">${product.price.toFixed(2)}</p>
              {product.category && (
                <span className="text-xs bg-gray-200 rounded-full px-1 md:px-2 py-0.5 md:py-1 mt-1 inline-block truncate max-w-full">
                  {product.category}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-1 md:space-x-2 mt-2 md:mt-4">
          <button
            onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
            disabled={currentPage === 1}
            className="px-2 md:px-4 py-1 md:py-2 bg-gray-200 rounded text-xs md:text-sm disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-gray-700 text-xs md:text-sm">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-2 md:px-4 py-1 md:py-2 bg-gray-200 rounded text-xs md:text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;

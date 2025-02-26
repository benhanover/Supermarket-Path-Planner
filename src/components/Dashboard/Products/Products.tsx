// import { useDashboard } from "../DashboardContext/useDashboard";
// import { Product } from "../types";

// interface ProductsProps {
//   searchTerm: string;
//   renderProduct?: (product: Product) => JSX.Element;
// }

// const Products = ({ searchTerm, renderProduct }: ProductsProps) => {
//   const { supermarket } = useDashboard(); // ✅ Get products from context

//   const filteredProducts = supermarket?.products.filter((product) =>
//     product.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//       {filteredProducts?.map((product) =>
//         renderProduct ? (
//           renderProduct(product)
//         ) : (
//           <div key={product.id} className="p-4 border rounded-lg shadow-sm">
//             <img
//               src={product.image}
//               alt={product.title}
//               className="w-full h-32 object-cover mb-2 rounded"
//             />
//             <h3 className="text-sm font-semibold">{product.title}</h3>
//             <p className="text-gray-500">${product.price}</p>
//           </div>
//         )
//       )}
//     </div>
//   );
// };

// export default Products;
import { useDashboard } from "../DashboardContext/useDashboard";
import { Product } from "../types";

interface ProductsProps {
  searchTerm: string;
  renderProduct?: (product: Product) => JSX.Element;
}

const Products = ({ searchTerm, renderProduct }: ProductsProps) => {
  const { supermarket, loading } = useDashboard();

  if (loading || !supermarket) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Filter products based on search term
  const filteredProducts = supermarket.products.filter(
    (product) =>
      product?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product?.category &&
        product.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product?.description &&
        product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredProducts.map((product) =>
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
  );
};

export default Products;

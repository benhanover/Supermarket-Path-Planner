import { useDashboard } from "../DashboardContext/useDashboard";
import { Product } from "../types";

interface ProductsProps {
  searchTerm: string;
  renderProduct?: (product: Product) => JSX.Element;
}

const Products = ({ searchTerm, renderProduct }: ProductsProps) => {
  const { supermarket } = useDashboard(); // ✅ Get products from context

  const filteredProducts = supermarket?.products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredProducts?.map((product) =>
        renderProduct ? (
          renderProduct(product)
        ) : (
          <div key={product.id} className="p-4 border rounded-lg shadow-sm">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-32 object-cover mb-2 rounded"
            />
            <h3 className="text-sm font-semibold">{product.title}</h3>
            <p className="text-gray-500">${product.price}</p>
          </div>
        )
      )}
    </div>
  );
};

export default Products;

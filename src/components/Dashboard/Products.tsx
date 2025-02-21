import { useEffect, useState } from "react";
import axios from "axios";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductsProps {
  searchTerm: string;
}

const Products = ({ searchTerm }: ProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredProducts.map((product) => (
        <div key={product.id} className="p-4 border rounded-lg shadow-sm">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-32 object-cover mb-2 rounded"
          />
          <h3 className="text-sm font-semibold">{product.title}</h3>
          <p className="text-gray-500">${product.price}</p>
        </div>
      ))}
    </div>
  );
};

export default Products;

import React from "react";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductsProps {
  products: Product[];
}

const Products: React.FC<ProductsProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.length > 0 ? (
        products.map((product) => (
          <div
            key={product.id}
            className="p-4 border rounded-lg shadow-md bg-white"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-32 object-cover rounded-md mb-2"
            />
            <h4 className="font-bold text-sm">{product.title}</h4>
            <p className="text-gray-600 text-sm">${product.price.toFixed(2)}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500 col-span-2 md:col-span-3 lg:col-span-4 text-center">
          No products found.
        </p>
      )}
    </div>
  );
};

export default Products;

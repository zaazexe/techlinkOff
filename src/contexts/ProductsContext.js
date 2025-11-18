// ...existing code...
import React, { createContext, useContext, useState } from 'react';

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);

  function addProduct(product) {
    setProducts(prev => [product, ...prev]);
  }

  const value = { products, addProduct, setProducts };
  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
}
// ...existing code...
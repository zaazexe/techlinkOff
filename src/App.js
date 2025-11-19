import React, { useState } from 'react';
import './App.css';
import Header from './components/header';
import Navbar from './components/navbar';
import Sidebar from './components/sidebar';
import ProductGrid from './components/productgrid';
import ProductDetail from './components/productdetail';
import CartPreview from './components/CartPreview';
import Footer from './components/footer';
import AddProductPage from './components/AddProductPage';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import CartPage from './components/cartpage';
import { ProductsProvider } from './contexts/ProductsContext';


function App(props) {
  const openProductManager = () => {
    window.open('/product-manager', '_blank', 'noopener,noreferrer');
  };

  // estado/handlers de filtro
  const [filters, setFilters] = useState({ category: null, option: null });

  const handleSelectFilter = (category, option = null) => {
    setFilters({ category, option });
  };

  const clearFilters = () => setFilters({ category: null, option: null });

  return (
    <ProductsProvider>
      <CartProvider>
        <Router>
          {
            // Inner layout component uses hooks from react-router inside Router
          }
          <InnerLayout filters={filters} onSelect={handleSelectFilter} onClear={clearFilters} />

            {/* Botão para abrir o Gerenciador de Produtos (não altera CSS existente) */}
            <div style={{ display: 'inline-block' }}>
             
            </div>
         
        </Router>
      </CartProvider>
    </ProductsProvider>
  );
}

function InnerLayout({ filters, onSelect, onClear }) {
  const location = useLocation();
  const { pathname } = location || { pathname: '/' };
  const showSidebar = pathname !== '/';

  return (
    <div className="App">
      <div className="header-cabecalho">
        <Header />
        <Navbar />
      </div>
      <div className={`main-content ${!showSidebar ? 'no-sidebar' : ''}`}>
        {pathname === '/' ? (
          <CartPreview />
        ) : (
          (showSidebar && pathname !== '/cart' && pathname !== '/add-product') && (
            <Sidebar
              selectedCategory={filters.category}
              selectedOption={filters.option}
              onSelect={onSelect}
              onClear={onClear}
            />
          )
        )}
        <Routes>
          <Route path="/" element={<ProductGrid filters={filters} />} />
          <Route path="/product" element={<ProductDetail />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/add-product" element={<AddProductPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
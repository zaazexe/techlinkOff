import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './../styles/Navbar.css';
import { CartContext } from '../contexts/CartContext';
import AddProductPanel from './AddProductPanel';


function Navbar(props) {
  const { cart = [] } = useContext(CartContext) || {};
  const count = cart.length || 0;
  const [showAddProduct, setShowAddProduct] = useState(false);

  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const doSearch = (q) => {
    const trimmed = (q || '').trim();
    if (!trimmed) {
      // remove query se estiver vazia — volta para a home
      navigate('/', { replace: false });
      return;
    }
    // navega para a página de produtos com q no querystring
    navigate(`/product?q=${encodeURIComponent(trimmed)}`, { replace: false });
  };

  // sincroniza o input com a query atual (útil quando já está em /product?q=...)
  useEffect(() => {
    try {
      const q = new URLSearchParams(location.search).get('q') || '';
      setSearch(q);
    } catch (e) { /* ignore */ }
  }, [location.search]);

  return (
    <nav className="navbar" >
      <div className="navbar-brand">
        <Link to="/" aria-label="Ir para a página inicial">
          <h1>TECHLINK</h1>
        </Link>
      </div>
      <div className="navbar-search">
        <input
          type="text"
          placeholder="Encontre aparelhos e periféricos usados..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); doSearch(search); } }}
          aria-label="Pesquisar produtos"
          
        />
        <button type="button" onClick={() => doSearch(search)} aria-label="Pesquisar" >
          🔍
        </button>
      </div>
      <div className="navbar-actions" >
        <button
          type="button"
          onClick={() => setShowAddProduct(true)}
          
        >
          Adicionar produtos
        </button>

        <Link
          to="/cart"
          className="cart-icon"
         
          aria-label="Ver carrinho"
        >
          <span aria-hidden="true">🛒</span>
          {count > 0 && (
            <span
              className="cart-count"
              aria-live="polite"
              
            >
              {count}
            </span>
          )}
        </Link>
      </div>

      {/* modal do formulário */}
      {showAddProduct && (
        <AddProductPanel
          onClose={() => setShowAddProduct(false)}
          defaultCategory={props.defaultCategory}
          addOptions={props.addOptions}
        />
      )}
    </nav>
  );
}

export default Navbar;
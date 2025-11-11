import React, { useState, useContext } from 'react';
import ProductCard from './productcard';
import './../styles/ProductGrid.css';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductsContext';
import AddProductPanel from './AddProductPanel';

export default function ProductGrid(props) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const { addToCart, items: cartItems = [] } = useContext(CartContext);
  const { products: ctxProducts = [] } = useProducts() || {};
  const products = props.products || ctxProducts || [];

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [addCategory, setAddCategory] = useState(null);

  const categories = [
    'Todas',
    'Placa Mãe',
    'Placa de Vídeo',
    'Processador',
    'Fonte',
    'Memória Ram',
    'Gabinete'
  ];

  // opções que aparecem DENTRO do pop-up
  const addOptions = ['Placa de Vídeo', 'Processador', 'Fonte', 'Gabinete'];

  const normalize = (s = '') =>
    s.toString().normalize?.('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();

  const getProductCategory = (product) => {
    return (product.category || product.categoria || '').toString();
  };

  const getProductBrandCandidates = (product) => {
    return [
      product.brand,
      product.marca,
      product.maker,
      product.fornecedor,
      product.vendor,
      product.manufacturer,
      product.fabricante,
      product.nomeMarca,
      product.brandName
    ].filter(Boolean).map(b => b.toString());
  };

  const activeCategory = (props.filters && props.filters.category) ? props.filters.category : selectedCategory;
  const activeOption = props.filters && props.filters.option ? props.filters.option : null;

  const byCategory = (product) => {
    if (!activeCategory || normalize(activeCategory) === 'todas') return true;
    return normalize(getProductCategory(product)) === normalize(activeCategory);
  };

  const byOption = (product) => {
    if (!activeOption) return true;
    const candidates = getProductBrandCandidates(product);
    return candidates.some(c => normalize(c).includes(normalize(activeOption)));
  };

  const filteredProducts = products.filter(product => byCategory(product) && byOption(product));

  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (typeof addToCart === 'function') {
      addToCart(product);
    } else {
      alert('Função addToCart não está disponível no CartContext.');
    }
  };

  // Abre o pop-up direto (sem mostrar menu antes)
  const handleOpenAddPopup = (presetCategory = null) => {
    setAddCategory(presetCategory);
    setShowAddProduct(true);
  };

  return (
    <main className="product-grid">
      <div >
        <div className="category-navigation">
          {categories.map(category => (
            <button
              key={category}
              className={((props.filters && props.filters.category ? props.filters.category : selectedCategory) === category) ? 'active' : ''}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div >


          {/* Abre diretamente o pop-up; as opções estão dentro do AddProductPanel */}

        </div>
      </div>

      <div className="products-container" >
        {filteredProducts.map(product => (
          <div
            key={product.id}
            className="product-item"
          
            onClick={() => handleCardClick(product.id)}
          >
            <ProductCard product={product} />
            <div className="product-actions" >
              <button
                onClick={e => {
                  e.stopPropagation();
                  alert(`Comprar: ${product.name || product.nome || ''}`);
                }}
              >
                Comprar
              </button>
              <button
                onClick={e => handleAddToCart(e, product)}
              >
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddProduct && (
        <AddProductPanel
          onClose={() => { setShowAddProduct(false); setAddCategory(null); }}
          defaultCategory={addCategory}
          addOptions={addOptions}
        />
      )}
    </main>
  );
}
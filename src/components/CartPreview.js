import React, { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';

export default function CartPreview() {
  const { cart = [], removeFromCart } = useContext(CartContext) || {};

  if (!cart || cart.length === 0) {
    return (
      <aside className="sidebar">
        <h3>Seu Carrinho</h3>
        <div style={{ color: '#666' }}>Carrinho vazio</div>
      </aside>
    );
  }

  return (
    <aside className="sidebar">
      <h3>Seu Carrinho</h3>
      <ul className="cart-list">
        {cart.map(item => (
          <li key={item.id} className="cart-item">
            <img src={item.imageUrl || item.image || item.img || 'https://via.placeholder.com/72x54?text=Sem+img'} alt={item.name} />
            <div className="meta">
              <div style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</div>
              <div style={{ fontSize: 13, color: '#666' }}>{typeof item.price === 'number' ? item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : item.price}</div>
            </div>
            <div>
              <button className="remove-btn" onClick={() => removeFromCart?.(item.id)}>Remover</button>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}

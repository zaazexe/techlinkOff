import React from 'react';
import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="footer-left">
          <strong>TECHLINK</strong>
          <div className="footer-copy">© {new Date().getFullYear()} Techlink. Todos os direitos reservados.</div>
        </div>
        <div className="footer-right">
          <a href="/">Início</a>
          <a href="/cart">Carrinho</a>
          <a href="/add-product">Adicionar produto</a>
        </div>
      </div>
    </footer>
  );
}

// Additional comments or code can be added here if needed

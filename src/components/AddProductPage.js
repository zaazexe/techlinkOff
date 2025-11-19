import React from 'react';
import AddProductForm from './AddProductForm';

export default function AddProductPage(props) {
  return (
    <div style={{ padding: 16, maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 12 }}>
        <h2>Adicionar Produtos</h2>
      </div>
      <AddProductForm defaultCategory={props.defaultCategory} addOptions={props.addOptions} />
    </div>
  );
}

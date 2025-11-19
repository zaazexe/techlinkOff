// ...existing code...
import React from 'react';
import AddProductForm from './AddProductForm';

export default function AddProductPanel({ onClose, defaultCategory = null, addOptions = [] }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{ position: 'fixed', left: 0, top: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: 520, background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 6px 24px rgba(0,0,0,0.2)' }}
      >
        <AddProductForm onClose={onClose} defaultCategory={defaultCategory} addOptions={addOptions} />
      </div>
    </div>
  );
}
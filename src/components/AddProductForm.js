import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../contexts/ProductsContext';

export default function AddProductForm({ onClose, defaultCategory = null, addOptions = [] }) {
  const { addProduct } = useProducts() || {};
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(defaultCategory || '');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const contentRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const validateImageUrl = (url) => {
    if (!url) return true;
    try {
      const u = new URL(url);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError(null);
    setImageError(null);

    if (!name.trim()) {
      setError('Nome é obrigatório.');
      return;
    }

    const parsedPrice = price === '' ? 0 : parseFloat(String(price).replace(',', '.'));
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setError('Preço inválido. Informe um número maior ou igual a 0.');
      return;
    }

    if (imageUrl && !validateImageUrl(imageUrl)) {
      setImageError('URL de imagem inválida.');
      return;
    }

    const descTrim = description.trim();
    const product = {
      id: Date.now().toString(),
      name: name.trim(),
      price: parsedPrice,
      category: category || null,
      image: imageUrl || null,
      imageUrl: imageUrl || null,
      img: imageUrl || null,
      imagem: imageUrl || null,
      foto: imageUrl || null,
      description: descTrim || null,
      descricao: descTrim || null,
      desc: descTrim || null,
      detalhe: descTrim || null,
      detalhes: descTrim || null
    };

    if (typeof addProduct === 'function') {
      addProduct(product);
    } else {
      console.info('Produto criado (local):', product);
    }

    // if used in page, navigate back to home after saving
    if (onClose) {
      onClose();
    } else {
      navigate('/');
    }
  };

  const categoryOptions = Array.from(new Set([
    ...(addOptions || []),
    'Placa Mãe',
    'Memória RAM',
    'Placa de Vídeo',
    'Processador',
    'Fonte',
    'Gabinete'
  ]));

  return (
    <div ref={contentRef} style={{ maxWidth: 720, margin: '0 auto', background: '#fff', padding: 16, borderRadius: 8 }}>
      <h3>Adicionar Produto</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="name-input">Nome</label><br />
          <input id="name-input" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label htmlFor="price-input">Preço</label><br />
          <input id="price-input" type="number" step="0.01" min="0" value={price} onChange={e => setPrice(e.target.value)} style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label htmlFor="description-input">Descrição</label><br />
          <textarea
            id="description-input"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Descrição do produto (opcional)"
            rows={4}
            style={{ width: '100%', resize: 'vertical' }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label htmlFor="image-input">URL da imagem</label><br />
          <input
            id="image-input"
            value={imageUrl}
            onChange={e => { setImageUrl(e.target.value); setImageError(null); setImageLoaded(false); }}
            placeholder="https://exemplo.com/imagem.jpg"
            style={{ width: '100%' }}
          />
          {imageError && <div style={{ color: 'red', marginTop: 6 }}>{imageError}</div>}
          {imageUrl && validateImageUrl(imageUrl) && !imageError && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 12, color: '#444', marginBottom: 6 }}>Preview:</div>
              <img
                src={imageUrl}
                alt="preview"
                style={{ maxWidth: '100%', maxHeight: 180, borderRadius: 6, border: '1px solid #eee', display: imageLoaded ? 'block' : 'none' }}
                onError={() => { setImageError('Não foi possível carregar a imagem.'); setImageLoaded(false); }}
                onLoad={() => { setImageError(null); setImageLoaded(true); }}
              />
              {!imageLoaded && !imageError && <div style={{ fontSize: 12, color: '#666' }}>Carregando...</div>}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Categoria</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
            {categoryOptions.map(opt => (
              <label key={opt} style={{ cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="category"
                  value={opt}
                  checked={category === opt}
                  onChange={() => setCategory(opt)}
                  style={{ marginRight: 8 }}
                />
                {opt}
              </label>
            ))}
            <label style={{ cursor: 'pointer' }}>
              <input
                type="radio"
                name="category"
                value=""
                checked={!category}
                onChange={() => setCategory('')}
                style={{ marginRight: 8 }}
              />
              Sem categoria
            </label>
          </div>
        </div>

        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button type="button" onClick={() => { if (onClose) onClose(); else navigate('/'); }}>Cancelar</button>
          <button type="submit" style={{ background: '#1976d2', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 4 }}>Salvar</button>
        </div>
      </form>
    </div>
  );
}

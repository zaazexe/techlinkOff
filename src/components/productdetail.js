import React, { useMemo, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useProducts } from '../contexts/ProductsContext';
import './../styles/ProductDetail.css';

export default function ProductDetail(/* props removed */) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Tratamento robusto para retorno do hook
  const productsCtx = useProducts();
  const products = Array.isArray(productsCtx) ? productsCtx : (productsCtx?.products || []);

  // corrige variável ausente — evita ReferenceError e permite mostrar resultados da busca
  const product = products.find(p => String(p.id) === String(id));
  
  useEffect(() => {
    console.log('ProductDetail: products length ->', products?.length);
  }, [products]);

  // lê query param 'q' enviado pelo Navbar
  const qParam = (() => {
    try {
      const v = new URLSearchParams(location.search).get('q') || '';
      console.log('ProductDetail: qParam ->', v);
      return v;
    } catch {
      return '';
    }
  })();

  // normaliza: lower, remove acentos, troca não-alfanum por espaço e colapsa espaços
  const normalize = (s = '') => {
    const base = String(s || '').toLowerCase();
    const noAccents = (base.normalize ? base.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : base);
    return noAccents.replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
  };

  const filtered = useMemo(() => {
    const q = normalize(qParam).trim();
    console.log('ProductDetail: normalized q ->', q);
    if (!q) return [];
    return products.filter(p => {
      if (!p) return false;
      // tenta vários campos comuns (name, titulo, nome, model, marca, description...)
      const name = normalize(p.name || p.titulo || p.nome || p.title || '');
      const desc = normalize(p.description || p.descricao || p.desc || p.detalhe || p.detalhes || '');
      const category = normalize(p.category || p.categoria || '');
      const brand = normalize(p.brand || p.marca || '');
      const pid = normalize(String(p.id || ''));
      const combined = [name, desc, category, brand, pid].join(' ');
      // debug rápido por item (apenas no console)
      // console.log('checking:', { id: p.id, name, combined });
      return combined.includes(q);
    });
  }, [products, qParam]);

  const imageSrc = product?.imageUrl || product?.image || product?.img || 'https://via.placeholder.com/400x300?text=Sem+imagem';
  const description = product?.description || product?.descricao || product?.desc || product?.detalhe || product?.detalhes || '';
  const priceFormatted = (typeof product?.price === 'number')
    ? product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : product?.price;

  const handleBack = () => {
    try {
      if (window && window.history && window.history.length > 2) {
        navigate(-1);
        return;
      }
    } catch (e) {
      // falha ao acessar history; fallback abaixo
    }
    navigate('/');
  };

  if (!product && !qParam) return <div style={{ padding: 16 }}>Produto não encontrado.</div>;

  return (
    <div style={{ padding: 16, maxWidth: 920, margin: '0 auto' }}>
      <button
        onClick={handleBack}
        aria-label="Voltar"
        className="back-button"
      >
        ← Voltar
      </button>

      {/* Se houver query, mostra os resultados filtrados */}
      {qParam ? (
        <div style={{ marginBottom: 12 }}>
          <div style={{ marginBottom: 8, color: '#333' }}>Resultados para "{qParam}": {filtered.length}</div>
          {filtered.length === 0 ? (
            <div style={{ color: '#666' }}>Nenhum produto encontrado.</div>
          ) : (
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {filtered.map(p => {
                const img = p.imageUrl || p.image || p.img || 'https://via.placeholder.com/120x90?text=Sem+imagem';
                const price = (typeof p.price === 'number') ? p.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : p.price;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      // navega para a rota do produto e remove query
                      navigate(`/product/${p.id}`);
                    }}
                    style={{ cursor: 'pointer', border: '1px solid #eee', padding: 8, borderRadius: 6, width: 220 }}
                  >
                    <img src={img} alt={p.name} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 4 }} />
                    <div style={{ marginTop: 8 }}>
                      <strong>{p.name}</strong>
                      <div style={{ color: '#666', fontSize: 14 }}>{price}</div>
                      {p.category ? <div style={{ fontSize: 12, color: '#888' }}>{p.category}</div> : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : null}

      {/* Exibe detalhe do produto (se existir) */}
      {product ? (
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <img
            src={imageSrc}
            alt={product.name}
            style={{ width: 400, height: 300, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee' }}
          />

          <div style={{ flex: 1, minWidth: 260 }}>
            <h1 style={{ marginTop: 0 }}>{product.name}</h1>

            <div style={{ margin: '8px 0' }}>
              <strong>Preço:</strong> <span>{priceFormatted}</span>
            </div>

            {product.category ? (
              <div style={{ margin: '8px 0' }}>
                <strong>Categoria:</strong> <span>{product.category}</span>
              </div>
            ) : null}

            <div style={{ marginTop: 12 }}>
              <strong>Descrição</strong>
              <p style={{ whiteSpace: 'pre-wrap', marginTop: 6, lineHeight: 1.5 }}>
                {description || <span style={{ color: '#666' }}>Sem descrição.</span>}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
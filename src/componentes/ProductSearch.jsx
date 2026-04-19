import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useProductos } from '../servicios/context/ProductosContext';
import '../estilos/search.css';

function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debouncedValue;
}

function HighlightText({ text, query }) {
    if (!query) return <span>{text}</span>;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
    const lowerQuery = query.toLowerCase();
    return (
        <span>
            {parts.map((part, i) =>
                part.toLowerCase() === lowerQuery
                    ? <mark key={i} className="search-highlight">{part}</mark>
                    : part
            )}
        </span>
    );
}

const ProductSearch = () => {
    const { productos, loading: productosLoading } = useProductos();
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    const debouncedTerm = useDebounce(searchTerm, 250);

    const featuredProducts = useMemo(() => productos.slice(0, 8), [productos]);

    const filteredProducts = useMemo(() => {
        if (!debouncedTerm || debouncedTerm.length < 2) return [];
        return productos.filter(p => {
            const matchesSearch =
                p.nombre.toLowerCase().includes(debouncedTerm.toLowerCase()) ||
                (p.categoria && p.categoria.toLowerCase().includes(debouncedTerm.toLowerCase()));
            const matchesCategory = !selectedCategory || p.categoria === selectedCategory;
            return matchesSearch && matchesCategory;
        }).slice(0, 8);
    }, [debouncedTerm, productos, selectedCategory]);

    const matchingCategories = useMemo(() => {
        if (!debouncedTerm || debouncedTerm.length < 2) return [];
        const cats = new Set(
            productos
                .filter(p => p.nombre.toLowerCase().includes(debouncedTerm.toLowerCase()))
                .map(p => p.categoria)
                .filter(Boolean)
        );
        return [...cats];
    }, [debouncedTerm, productos]);

    const openOverlay = () => {
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeOverlay = useCallback(() => {
        setIsOpen(false);
        setSearchTerm('');
        setSelectedCategory(null);
        setActiveIndex(-1);
        document.body.style.overflow = '';
    }, []);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 80);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') closeOverlay(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [closeOverlay]);

    const handleSelect = useCallback((id) => {
        closeOverlay();
        navigate(`/detalle/${id}`);
    }, [navigate, closeOverlay]);

    const handleClear = () => {
        setSearchTerm('');
        setSelectedCategory(null);
        setActiveIndex(-1);
        inputRef.current?.focus();
    };

    const handleSubmit = async () => {
        if (!searchTerm || filteredProducts.length === 0) return;
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 600));
        setIsLoading(false);
        if (filteredProducts.length === 1) handleSelect(filteredProducts[0].id);
    };

    const handleKeyDown = (e) => {
        const items = filteredProducts;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(i => Math.min(i + 1, items.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(i => Math.max(i - 1, -1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex >= 0 && items[activeIndex]) {
                handleSelect(items[activeIndex].id);
            } else {
                handleSubmit();
            }
        }
    };

    const overlay = isOpen ? (
        <div className="search-overlay" onClick={(e) => e.target === e.currentTarget && closeOverlay()}>
            <div className="search-overlay-panel">

                {/* BARRA SUPERIOR */}
                <div className="search-overlay-bar">
                    <div className="search-overlay-input-wrap">
                        {isLoading ? (
                            <span className="search-spinner" />
                        ) : (
                            <svg className="search-overlay-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        )}
                        <input
                            ref={inputRef}
                            type="text"
                            className="search-overlay-input"
                            placeholder="¿Qué estás buscando?"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setSelectedCategory(null);
                                setActiveIndex(-1);
                            }}
                            onKeyDown={handleKeyDown}
                            aria-label="Buscar productos"
                        />
                        {searchTerm && (
                            <button className="search-overlay-clear" onClick={handleClear} aria-label="Limpiar">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <button className="search-overlay-close" onClick={closeOverlay}>
                        Cerrar
                    </button>
                </div>

                {/* CONTENIDO */}
                <div className="search-overlay-body-wrap">
                <div className="search-overlay-body">

                    {/* SIN QUERY: productos destacados */}
                    {!searchTerm && (
                        <div className="search-overlay-section">
                            <p className="search-overlay-label">Te puede interesar</p>
                            {productosLoading ? (
                                <div className="search-grid">
                                    {[...Array(8)].map((_, i) => <div key={i} className="search-skeleton" />)}
                                </div>
                            ) : (
                                <div className="search-grid">
                                    {featuredProducts.map(product => (
                                        <div
                                            key={product.id}
                                            className="search-card"
                                            onClick={() => handleSelect(product.id)}
                                        >
                                            <div className="search-card-img-wrap">
                                                <img src={product.imagen} alt={product.nombre} className="search-card-img" />
                                                <div className="search-card-overlay">
                                                    <span className="search-card-overlay-btn">Ver producto</span>
                                                </div>
                                            </div>
                                            <div className="search-card-info">
                                                <span className="search-card-name">{product.nombre}</span>
                                                <span className="search-card-price">
                                                    {Number(product.precio).toLocaleString('es-ES')} €
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* CON QUERY: resultados */}
                    {searchTerm && debouncedTerm.length >= 2 && (
                        <div className="search-overlay-section">

                            {/* Chips de categoría */}
                            {matchingCategories.length > 1 && (
                                <div className="search-chips-row">
                                    <button
                                        className={`search-chip ${!selectedCategory ? 'active' : ''}`}
                                        onClick={() => setSelectedCategory(null)}
                                    >
                                        Todo
                                    </button>
                                    {matchingCategories.map(cat => (
                                        <button
                                            key={cat}
                                            className={`search-chip ${selectedCategory === cat ? 'active' : ''}`}
                                            onClick={() => setSelectedCategory(cat)}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {filteredProducts.length > 0 ? (
                                <>
                                    <p className="search-overlay-label">
                                        {filteredProducts.length} resultado{filteredProducts.length !== 1 ? 's' : ''}
                                    </p>
                                    <div className="search-results-grid">
                                        {filteredProducts.map((product, i) => (
                                            <div
                                                key={product.id}
                                                className={`search-result-row ${activeIndex === i ? 'active' : ''}`}
                                                onClick={() => handleSelect(product.id)}
                                            >
                                                <img src={product.imagen} alt={product.nombre} className="search-result-img" />
                                                <div className="search-result-info">
                                                    <span className="search-result-name">
                                                        <HighlightText text={product.nombre} query={debouncedTerm} />
                                                    </span>
                                                    {product.categoria && (
                                                        <span className="search-result-cat">{product.categoria}</span>
                                                    )}
                                                    <span className="search-result-price">
                                                        {Number(product.precio).toLocaleString('es-ES')} €
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="search-no-results">
                                    Sin resultados para "<strong>{debouncedTerm}</strong>"
                                </div>
                            )}
                        </div>
                    )}

                    {/* Escribiendo pero debounce aún no disparó */}
                    {searchTerm && debouncedTerm.length < 2 && (
                        <div className="search-hint">Sigue escribiendo...</div>
                    )}
                </div>
                </div>
            </div>
        </div>
    ) : null;

    return (
        <>
            {/* TRIGGER en el nav */}
            <button className="search-trigger-btn" onClick={openOverlay} aria-label="Abrir buscador">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
            </button>

            {/* OVERLAY montado en el body */}
            {createPortal(overlay, document.body)}
        </>
    );
};

export default ProductSearch;

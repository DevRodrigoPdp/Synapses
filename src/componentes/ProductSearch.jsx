import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProductos } from '../servicios/context/ProductosContext';
import '../estilos/search.css';

const ProductSearch = () => {
    const { productos, loading } = useProductos();
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);
    const navigate = useNavigate();

    // Filtra productos según el término de búsqueda
    const filteredProducts = searchTerm.length > 1 && !loading
        ? productos.filter(p =>
            p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.categoria && p.categoria.toLowerCase().includes(searchTerm.toLowerCase()))
        ).slice(0, 5) // Mostrar máximo 5 resultados
        : [];

    useEffect(() => {
        // Cierra los resultados si se hace click fuera
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const handleSelectProduct = (id) => {
        setIsOpen(false);
        setSearchTerm('');
        navigate(`/detalle/${id}`);
    };

    return (
        <div className="search-container" ref={wrapperRef}>
            <div className="search-input-wrapper">
                <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                />
                {searchTerm && (
                    <button className="search-clear" onClick={() => setSearchTerm('')}>
                        ×
                    </button>
                )}
            </div>

            {isOpen && searchTerm.length > 1 && (
                <div className="search-results-dropdown">
                    {filteredProducts.length > 0 ? (
                        <>
                            <div className="search-results-header">RESULTADOS</div>
                            <div className="search-results-list">
                                {filteredProducts.map(product => (
                                    <div
                                        key={product.id}
                                        className="search-result-item"
                                        onClick={() => handleSelectProduct(product.id)}
                                    >
                                        <img src={product.imagen} alt={product.nombre} className="search-item-img" />
                                        <div className="search-item-info">
                                            <span className="search-item-name">{product.nombre}</span>
                                            <span className="search-item-price">{Number(product.precio).toLocaleString('es-ES')} €</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="search-no-results">No se encontraron productos para "{searchTerm}"</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductSearch;

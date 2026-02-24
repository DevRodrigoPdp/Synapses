import { Link } from 'react-router-dom';
import React, { useState, useMemo } from 'react';
import '../estilos/cuerpo.css';
import VelocityBar from '../componentes/VelocityBar';
import Portada from '../componentes/Portada';
import FiltrosLateral from '../componentes/FiltrosLateral';

// IMPORTAMOS LOS HOOKS
import { useProductos } from '../servicios/context/ProductosContext';
import { useCarrito } from '../servicios/context/CarritoContext';

function Cuerpo() {
    const { productos, loading } = useProductos();
    const { agregar } = useCarrito();

    // ESTADO DEL FILTRO
    const [categoriaActiva, setCategoriaActiva] = useState('Todas');

    // Extraer categorías únicas disponibles
    const categoriasUnicas = useMemo(() => {
        if (!productos || productos.length === 0) return ['Todas'];
        const cats = new Set(productos.filter(p => !p.ocasion && p.categoria).map(p => p.categoria));
        return ['Todas', ...Array.from(cats)];
    }, [productos]);

    // Filtrar los productos según la selección
    const productosParaMostrar = useMemo(() => {
        if (!productos) return [];
        let filtrados = productos.filter(item => item.ocasion === false);
        if (categoriaActiva !== 'Todas') {
            filtrados = filtrados.filter(item => item.categoria === categoriaActiva);
        }
        return filtrados;
    }, [productos, categoriaActiva]);

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>CARGANDO CATALOGO SYNAPSES...</div>;

    return (
        <>
            <VelocityBar />
            <Portada />

            <div className="contenido-pagina">
                <div className="seccion-productos" id="productos">

                    <h3 className='h3-Productos'>NUESTROS PRODUCTOS</h3>

                    {/* SEXTA FASE: Layout Flex para Barra Lateral + Grid */}
                    <div style={{ display: 'flex', width: '100%', maxWidth: '1800px', margin: '0 auto', flexDirection: 'row' }}>

                        {/* BARRA LATERAL IZQUIERDA (Filtros) */}
                        <FiltrosLateral
                            categorias={categoriasUnicas}
                            categoriaActiva={categoriaActiva}
                            setCategoriaActiva={setCategoriaActiva}
                        />

                        {/* CONTENEDOR DERECHO (Grid Productos) */}
                        <div style={{ flex: 1, minWidth: '300px' }}>

                            {/* LISTADO DE PRODUCTOS UNIFICADO */}
                            <div className="product-list" style={{ maxWidth: '100%', margin: 0 }}>
                                {productosParaMostrar.map((item) => {
                                    // SIMULACIÓN DE STOCK
                                    const randomStock = String(item.id).charCodeAt(0) % 3;
                                    const isOutOfStock = randomStock === 2;

                                    return (
                                        <div className="product-card" key={item.id}>
                                            <div className="product-image-container">
                                                {isOutOfStock ? (
                                                    <div className="new-badge" style={{ background: '#333', color: '#999' }}>AGOTADO</div>
                                                ) : (
                                                    <>
                                                        {item.porcentaje > 0 && <div className="new-badge" style={{ background: '#ef4444' }}>-{item.porcentaje}%</div>}
                                                        {item.porcentaje === 0 && <div className="new-badge">NUEVO</div>}
                                                    </>
                                                )}

                                                <div className="brand-badge">SYNAPSES / EXCLUSIVA</div>
                                                <Link to={`/detalle/${item.id}`}>
                                                    <img src={item.imagen} alt={item.nombre} className={`product-image ${isOutOfStock ? 'img-agotado' : ''}`} />
                                                </Link>
                                                <div
                                                    className={`hover-action-overlay ${isOutOfStock ? 'overlay-agotado' : ''}`}
                                                    onClick={(e) => {
                                                        if (isOutOfStock) {
                                                            e.preventDefault();
                                                            return;
                                                        }
                                                        agregar(item);
                                                    }}
                                                >
                                                    <button className={`hover-buy-btn ${isOutOfStock ? 'btn-agotado' : ''}`}>
                                                        {isOutOfStock ? 'AGOTADO' : 'AÑADIR AL CARRITO'}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="product-info-container">
                                                <h3 className="product-name">{item.nombre}</h3>
                                                <div className="product-price">
                                                    {item.porcentaje > 0 ? (
                                                        <span>
                                                            <span style={{ textDecoration: 'line-through', color: '#999', marginRight: '8px', fontSize: '0.85em' }}>
                                                                {Number(item.precio).toLocaleString('es-ES')} €
                                                            </span>
                                                            <span style={{ color: '#ef4444' }}>
                                                                {Number(item.precio - (item.precio * (item.porcentaje / 100))).toLocaleString('es-ES')} €
                                                            </span>
                                                        </span>
                                                    ) : (
                                                        <span>{Number(item.precio).toLocaleString('es-ES')} €</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {productosParaMostrar.length === 0 && (
                                <div style={{ padding: '50px 0', textAlign: 'center', opacity: 0.5, letterSpacing: '2px', fontFamily: 'Inter, sans-serif' }}>
                                    NO HAY PRODUCTOS EN ESTA CATEGORÍA
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Cuerpo;
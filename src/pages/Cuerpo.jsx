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
                                {productosParaMostrar.map((item) => (
                                    <div className="product-card" key={item.id}>
                                        <div className="product-image-container">
                                            {item.porcentaje > 0 && <div className="new-badge">-{item.porcentaje}%</div>}
                                            {item.porcentaje === 0 && <div className="new-badge">NEW</div>}
                                            <div className="brand-badge">SYNAPSES / EXCLUSIVA</div>
                                            <Link to={`/detalle/${item.id}`}>
                                                <img src={item.imagen} alt={item.nombre} className="product-image" />
                                            </Link>
                                            <div className="hover-action-overlay" onClick={() => agregar(item)}>
                                                <button className="hover-buy-btn">AÑADIR AL CARRITO</button>
                                            </div>
                                        </div>
                                        <div className="product-info-container">
                                            <h3 className="product-name">{item.nombre}</h3>
                                            <div className="product-price">
                                                {item.porcentaje > 0 ? (
                                                    <span>{Number(item.precio - (item.precio * (item.porcentaje / 100))).toLocaleString('es-ES')} €</span>
                                                ) : (
                                                    <span>{Number(item.precio).toLocaleString('es-ES')} €</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
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
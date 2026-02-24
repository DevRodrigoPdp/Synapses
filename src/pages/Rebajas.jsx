import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../estilos/cuerpo.css';
import VelocityBar from '../componentes/VelocityBar';
import FiltrosLateral from '../componentes/FiltrosLateral';

// 1. IMPORTAMOS LOS NUEVOS HOOKS7
import { useProductos } from '../servicios/context/ProductosContext';
import { useCarrito } from '../servicios/context/CarritoContext';

function Rebajas() {
    // 2. YA NO USAMOS PROPS NI LLAMADAS API LOCALES
    const { productos, loading } = useProductos();
    const { agregar } = useCarrito();

    // 3. FILTRAMOS LOS PRODUCTOS QUE YA TENEMOS EN MEMORIA (Solo rebajas)
    const rebajas = useMemo(() => {
        if (!productos) return [];
        return productos.filter(item => item.ocasion === true);
    }, [productos]);

    // ESTADO DEL FILTRO
    const [categoriaActiva, setCategoriaActiva] = useState('Todas');

    // Extraer categorías únicas disponibles en rebajas
    const categoriasUnicas = useMemo(() => {
        if (!rebajas || rebajas.length === 0) return ['Todas'];
        const cats = new Set(rebajas.filter(p => p.categoria).map(p => p.categoria.trim()));
        return ['Todas', ...Array.from(cats)];
    }, [rebajas]);

    // Filtrar las rebajas según la selección de categoría
    const rebajasParaMostrar = useMemo(() => {
        if (!rebajas) return [];
        let filtrados = rebajas;
        if (categoriaActiva !== 'Todas') {
            filtrados = filtrados.filter(item => item.categoria && item.categoria.trim() === categoriaActiva);
        }

        // Ordenamos: Primero los que TIENEN STOCK, al final los AGOTADOS
        return [...filtrados].sort((a, b) => {
            const isAgotadoA = String(a.id).charCodeAt(0) % 3 === 2;
            const isAgotadoB = String(b.id).charCodeAt(0) % 3 === 2;

            if (isAgotadoA && !isAgotadoB) return 1;  // A va después
            if (!isAgotadoA && isAgotadoB) return -1; // A va antes
            return 0; // Si son iguales, mantienen su orden
        });
    }, [rebajas, categoriaActiva]);

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>BUSCANDO OFERTAS...</div>;

    return (
        <>
            <VelocityBar />
            <div className="contenido-pagina">
                <div className="seccion-productos" id="productos">
                    <h3 className='h3-Productos'>PRODUCTOS EN REBAJAS</h3>

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

                            <div className="product-list" style={{ maxWidth: '100%', margin: 0 }}>
                                {rebajasParaMostrar.length > 0 ? (
                                    rebajasParaMostrar.map((item) => {
                                        // SIMULACIÓN DE STOCK
                                        const randomStock = String(item.id).charCodeAt(0) % 3;
                                        const isOutOfStock = randomStock === 2;

                                        return (
                                            <div className="product-card" key={item.id}>

                                                <div className="product-image-container">
                                                    {isOutOfStock ? (
                                                        <div className="new-badge" style={{ background: '#333', color: '#999' }}>AGOTADO</div>
                                                    ) : (
                                                        item.porcentaje > 0 && <div className="new-badge" style={{ background: '#ef4444', color: '#fff' }}>-{item.porcentaje}%</div>
                                                    )}

                                                    <div className="brand-badge">SYNAPSES / OFERTA</div>

                                                    {/* Fotografía principal */}
                                                    <Link to={`/detalle/${item.id}`}>
                                                        <img
                                                            src={item.imagen}
                                                            alt={item.nombre}
                                                            className={`product-image ${isOutOfStock ? 'img-agotado' : ''}`}
                                                        />
                                                    </Link>

                                                    {/* Banner interactivo (Hover) Inferior */}
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

                                                {/* Info extremadamente limpia (Solo nombre y precio, gris oscuro minúsculo) */}
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
                                    })
                                ) : (
                                    <div style={{ padding: '50px 0', textAlign: 'center', opacity: 0.5, letterSpacing: '2px', fontFamily: 'Inter, sans-serif' }}>
                                        NO HAY OFERTAS DISPONIBLES EN ESTA CATEGORÍA
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Rebajas;

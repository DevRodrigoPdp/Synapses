import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../estilos/cuerpo.css';
import VelocityBar from '../componentes/VelocityBar';

// 1. IMPORTAMOS LOS NUEVOS HOOKS7
import { useProductos } from '../servicios/context/ProductosContext';
import { useCarrito } from '../servicios/context/CarritoContext';

function Rebajas() {
    // 2. YA NO USAMOS PROPS NI LLAMADAS API LOCALES
    const { productos, loading } = useProductos();
    const { agregar } = useCarrito();

    // 3. FILTRAMOS LOS PRODUCTOS QUE YA TENEMOS EN MEMORIA
    const rebajas = productos.filter(item => item.ocasion === true);

    if (loading) return <div style={{textAlign:'center', padding: '50px'}}>BUSCANDO OFERTAS...</div>;

    return (
        <>
            <VelocityBar/>
            <div className="contenido-pagina">
                <div className="seccion-productos" id="productos">
                    <h3 className='h3-Productos'>PRODUCTOS EN REBAJAS</h3>

                    <div className="product-list">
                        {rebajas.length > 0 ? (
                            rebajas.map((item) => (
                                <div className="product-card" key={item.id}>
                                    
                                    {/* Cabezal */}
                                    <div className="product-card-header">
                                        <h2 className="brand-label">SYNAPSES</h2>
                                        <span className="compare-label">+ COMPARE</span>
                                    </div>

                                    {/* Badge de Descuento */}
                                    {item.porcentaje && (
                                        <div className="badge-rebaja-top">
                                            -{item.porcentaje}%
                                        </div>
                                    )}

                                    <div className="product-image-container">
                                        <Link to={`/detalle/${item.id}`}>
                                            <img src={item.imagen} alt={item.nombre} className="product-image" />
                                        </Link>
                                    </div>

                                    <div className="product-info-container">
                                        <h3 className="product-name">{item.nombre}</h3>

                                        <div className="precios-rebajados-container">
                                            <p className="product-price price-sale">
                                                {Number(item.precio).toLocaleString('es-ES')} €
                                            </p>
                                            <span className="etiqueta-oferta-mini">OFERTA</span>
                                        </div>

                                        <p className="product-description">
                                            {item.descripcion || "Rendimiento premium a un precio excepcional."}
                                        </p>

                                        {/* USAMOS LA NUEVA FUNCIÓN AGREGAR */}
                                        <button
                                            className="buy-button"
                                            onClick={() => agregar(item)}
                                        >
                                            Añadir al carrito
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{textAlign: 'center', width: '100%'}}>No hay ofertas disponibles en este momento.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Rebajas;

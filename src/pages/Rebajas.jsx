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
                                    
                                    <div className="product-image-container">
                                        {/* Badges superiores incrustados en la foto */}
                                        {item.porcentaje > 0 && (
                                            <div className="new-badge">-{item.porcentaje}%</div>
                                        )}
                                        
                                        <div className="brand-badge">SYNAPSES / OFERTA</div>
                                        
                                        {/* Fotografía principal */}
                                        <Link to={`/detalle/${item.id}`}>
                                            <img
                                                src={item.imagen}
                                                alt={item.nombre}
                                                className="product-image"
                                            />
                                        </Link>

                                        {/* Banner interactivo (Hover) Inferior */}
                                        <div className="hover-action-overlay" onClick={() => agregar(item)}>
                                            <button className="hover-buy-btn">
                                                AÑADIR AL CARRITO
                                            </button>
                                        </div>
                                    </div>

                                    {/* Info extremadamente limpia (Solo nombre y precio, gris oscuro minúsculo) */}
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

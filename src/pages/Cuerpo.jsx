import { Link } from 'react-router-dom';
import '../estilos/cuerpo.css';
import VelocityBar from '../componentes/VelocityBar';
import Portada from '../componentes/Portada';

// IMPORTAMOS LOS HOOKS
import { useProductos } from '../servicios/context/ProductosContext';
import { useCarrito } from '../servicios/context/CarritoContext';

function Cuerpo() {
    // 1. Usamos el contexto en lugar de props o useEffects locales
    const { productos, loading } = useProductos();
    const { agregar } = useCarrito();

    if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>CARGANDO CATALOGO SYNAPSES...</div>;

    return (
        <>
            <VelocityBar />
            <Portada /> 
           

            <div className="contenido-pagina">
                <div className="seccion-productos" id="productos">

                    <h3 className='h3-Productos'>NUESTROS PRODUCTOS</h3>

                    <div className="product-list">
                        {productos
                            .filter(item => item.ocasion === false) // Filtramos por no ocasión
                            .map((item) => (
                                <div className="product-card" key={item.id}>
                                    
                                    {/* Cabecera */}
                                    <div className="product-card-header">
                                        <h2 className="brand-label">SYNAPSES</h2>
                                        <span className="compare-label">+ COMPARE</span>
                                    </div>

                                    {/* Imagen */}
                                    <div className="product-image-container">
                                        <Link to={`/detalle/${item.id}`}>
                                            <img
                                                src={item.imagen}
                                                alt={item.nombre}
                                                className="product-image"
                                            />
                                        </Link>
                                    </div>

                                    {/* Info */}
                                    <div className="product-info-container">
                                        <h3 className="product-name">{item.nombre}</h3>
                                        <p className="product-price">
                                            {Number(item.precio).toLocaleString('es-ES')} €
                                        </p>
                                        <p className="product-description">
                                            {item.descripcion || "Ingeniería de vanguardia."}
                                        </p>

                                        {/* USAMOS LA FUNCIÓN AGREGAR DEL CONTEXTO */}
                                        <button
                                            className="buy-button"
                                            onClick={() => agregar(item)}
                                        >
                                            Añadir al carrito
                                        </button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default Cuerpo;
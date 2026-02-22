import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import '../estilos/detalleProducto.css';

// 1. IMPORTAMOS LOS CONTEXTOS
import { useCarrito } from "../servicios/context/CarritoContext";
import { useProductos } from "../servicios/context/ProductosContext";

function DetalleProducto() { 
    // YA NO RECIBIMOS PROPS. Usamos los hooks.
    const { id } = useParams();
    
    // Traemos la lista completa y la función de cargar
    const { productos, loading: loadingGlobal } = useProductos();
    
    // Traemos la función de añadir al carrito
    const { agregar } = useCarrito();

    const [infoProducto, setInfoProducto] = useState(null); 
    const [cantidad, setCantidad] = useState(1);
    const [activeTab, setActiveTab] = useState('specs');

    // 2. EFECTO: BUSCAR EL PRODUCTO EN LA LISTA GLOBAL
    // En lugar de hacer una petición nueva a la API, lo buscamos en lo que ya descargamos
    useEffect(() => {
        if (productos.length > 0) {
            // Buscamos el producto cuyo ID coincida con la URL
            // Usamos String() para asegurar que "4" sea igual a 4
            const encontrado = productos.find(p => String(p.id) === String(id));
            setInfoProducto(encontrado || null);
        }
    }, [id, productos]);



    const formatearMoneda = (cantidad) => {
        if (!cantidad) return "0 €";
        return Number(cantidad).toLocaleString('de-DE', { 
            minimumFractionDigits: 0, 
            maximumFractionDigits: 2 
        }) + " €";
    };

    const incrementar = () => setCantidad(prev => prev + 1);
    const decrementar = () => setCantidad(prev => (prev > 1 ? prev - 1 : 1));

    // 4. NUEVA FUNCIÓN AÑADIR (Usando el Contexto)
    const handleAddToCart = () => {
        if (!infoProducto) return;

        for(let i = 0; i < cantidad; i++) {
            // Llamamos directamente a la función del contexto
            agregar(infoProducto);
        }
        setCantidad(1);
        // Opcional: Podrías poner un toast.success aquí si quisieras
    };

    // Renderizado condicional
    if (loadingGlobal && productos.length === 0) return <div className="loading-screen">CARGANDO PROTOCOLO...</div>;
    if (!infoProducto && !loadingGlobal) return <div className="error-screen">PRODUCTO NO ENCONTRADO EN LA BASE DE DATOS</div>;

    // Si todavía se está buscando (el array tiene datos pero el find no ha terminado en el primer render)
    if (!infoProducto) return <div className="loading-screen">BUSCANDO REFERENCIA...</div>;

    return (
        <div className="detalle-page">
            
            {/* BARRA DE PROGRESO FIJA */}
          
            {/* BREADCRUMBS */}
            <div className="breadcrumbs wide-container">
                <Link to="/">INICIO</Link>
                <span className="separator">/</span>
                <Link to="/">PRODUCTOS</Link>
                <span className="separator">/</span>
                <span className="current">{infoProducto.nombre}</span>
            </div>

            {/* SECCIÓN PRINCIPAL (HERO) */}
            <div className="detalle-container wide-layout">
                
                {/* COLUMNA IZQUIERDA: IMAGEN + INDICADOR */}
                <div className="col-imagen-expanded">
                    <div className="imagen-principal-wrapper">
                        <img 
                            src={infoProducto.imagen} 
                            alt={infoProducto.nombre} 
                            className="img-main"
                            style={{ mixBlendMode: 'normal' }}
                        />
                    </div>
                    
                    <div className="scroll-indicator-wrapper">
                        <div className="mouse-scroll">
                            <span className="mouse-wheel"></span>
                        </div>
                        <span className="scroll-text">SCROLL PARA DATOS TÉCNICOS</span>
                    </div>
                </div>

                {/* COLUMNA DERECHA: INFO Y COMPRA */}
                <div className="col-info-expanded">
                    <div className="product-header">
                        <h2 className="marca">SYNAPSES LAB // SERIES</h2>
                        <h1 className="titulo">{infoProducto.nombre}</h1>
                        <div className="badges-row">
                            <div className="stock-badge">
                                <span className="dot-green"></span> DISPONIBLE
                            </div>
                            <span className="sku-badge">REF: SYN-{infoProducto.id}</span>
                        </div>
                    </div>

                    <div className="precio-block-large">
                        <span className="precio">{formatearMoneda(infoProducto.precio)}</span>
                        <div className="financiacion">
                            <span>Financiación disponible: 12 cuotas de {formatearMoneda(infoProducto.precio / 12)}</span>
                        </div>
                    </div>

                    <div className="highlights-grid">
                        <div className="hl-item">
                            <span className="hl-icon">⚡</span>
                            <span className="hl-text">AERO DYNAMICS</span>
                        </div>
                        <div className="hl-item">
                            <span className="hl-icon">⚖️</span>
                            <span className="hl-text">ULTRA LIGHT</span>
                        </div>
                        <div className="hl-item">
                            <span className="hl-icon">🛡️</span>
                            <span className="hl-text">3Y WARRANTY</span>
                        </div>
                    </div>

                    <div className="descripcion-short">
                        <p>{infoProducto.descripcion || "Ingeniería de alta precisión diseñada para maximizar el rendimiento. Cada unidad es sometida a pruebas de fatiga extrema en nuestro laboratorio."}</p>
                    </div>

                    <div className="compra-actions-expanded">
                        <div className="selector-cantidad">
                            <button onClick={decrementar}>−</button>
                            <span>{cantidad}</span>
                            <button onClick={incrementar}>+</button>
                        </div>
                        <button className="btn-add-cart-large" onClick={handleAddToCart}>
                            AÑADIR AL CARRITO
                        </button>
                    </div>

                    <div className="product-tabs-container">
                        <div className="tabs-header">
                            <button className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`} onClick={() => setActiveTab('specs')}>ESPECIFICACIONES</button>
                            <button className={`tab-btn ${activeTab === 'shipping' ? 'active' : ''}`} onClick={() => setActiveTab('shipping')}>ENVÍO</button>
                        </div>
                        <div className="tab-content">
                            {activeTab === 'specs' && (
                                <table className="specs-table">
                                    <tbody>
                                        <tr><td>CATEGORÍA</td><td>{infoProducto.categoria || "Racing Series"}</td></tr>
                                        <tr><td>MATERIAL</td><td>Fibra de Carbono T1100 Unidireccional</td></tr>
                                        <tr><td>PAR DE APRIETE</td><td>5 Nm Máx.</td></tr>
                                        <tr><td>CERTIFICACIÓN</td><td>ISO 4210-Racing</td></tr>
                                    </tbody>
                                </table>
                            )}
                            {activeTab === 'shipping' && (
                                <div className="shipping-details">
                                    <p><strong>LOGÍSTICA:</strong> Entrega en 24/48 horas vía DHL Express.</p>
                                    <p><strong>RECOGIDA:</strong> Disponible en Synapses Lab Madrid.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* SECCIÓN 2: INGENIERÍA (FONDO OSCURO) */}
            <div className="full-width-section dark-bg">
                {/* ELIMINADO: wide-container - ahora el contenido usa full-width-inner */}
                <div className="full-width-inner content-split">
                    <div className="text-side">
                        <h4 className="subtitle-tech">R&D DEPARTMENT</h4>
                        <h2 className="title-tech">LAMINADO DE ALTA DENSIDAD</h2>
                        <p>
                            Utilizamos un proceso de compactación al vacío que elimina cualquier micro-burbuja en la resina, logrando una estructura 
                            un 15% más rígida que los estándares de la industria sin añadir un solo gramo de peso.
                        </p>
                        <ul className="tech-list">
                            <li>Análisis estructural mediante Elementos Finitos (FEA).</li>
                            <li>Fibra de grado militar ultra-resistente.</li>
                            <li>Optimización del flujo de aire laminar.</li>
                        </ul>
                    </div>
                    <div className="visual-side">
                        <div className="tech-graphic">
                            <span className="graphic-label">PERFORMANCE METRICS</span>
                            <div className="bar-chart">
                                <div className="bar" style={{height: '70%'}}><span>STANDARD</span></div>
                                <div className="bar active" style={{height: '100%'}}><span>SYNAPSES</span></div>
                                <div className="bar" style={{height: '60%'}}><span>PREV GEN</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECCIÓN 3: REVIEWS / FEEDBACK */}
            <div className="full-width-section light-bg">
                {/* ELIMINADO: wide-container - ahora usa full-width-inner */}
                <div className="full-width-inner">
                    <h2 className="section-title-center">FIELD TEST REPORTS // PILOTS</h2>
                    <div className="reviews-grid">
                        <div className="review-card">
                            <div className="stars">★★★★★</div>
                            <h3>"EQUILIBRIO PERFECTO"</h3>
                            <p>"Es increíble cómo absorbe las vibraciones pero mantiene una rigidez brutal al sprintar. El mejor componente que he probado."</p>
                            <span className="author">— Julian R., Elite Rider</span>
                        </div>
                        <div className="review-card">
                            <div className="stars">★★★★★</div>
                            <h3>"CALIDAD SIN COMPROMISOS"</h3>
                            <p>"Desde el packaging hasta el último tornillo, se nota que es un producto diseñado por y para entusiastas de la técnica."</p>
                            <span className="author">— Pro Mechanics Lab</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECCIÓN 4: FAQ TÉCNICO */}
            <div className="full-width-section white-bg">
                {/* ELIMINADO: wide-container - ahora usa full-width-inner con faq-container */}
                <div className="full-width-inner faq-container">
                    <h2 className="section-title-left">TECHNICAL QUESTIONS</h2>
                    <div className="faq-item">
                        <details>
                            <summary>¿Se incluye pasta de montaje de carbono?</summary>
                            <p>Sí, cada componente de carbono de Synapses Lab incluye un sobre de 5g de pasta de fricción para asegurar un montaje seguro con el par de apriete mínimo.</p>
                        </details>
                    </div>
                    <div className="faq-item">
                        <details>
                            <summary>¿Cuál es la política de Crash Replacement?</summary>
                            <p>Si sufres un accidente que daña el componente, te ofrecemos un descuento del 40% en una unidad nueva para que vuelvas a rodar cuanto antes.</p>
                        </details>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetalleProducto;

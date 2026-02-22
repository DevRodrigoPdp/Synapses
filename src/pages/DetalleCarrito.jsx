import React, { useState } from 'react';
import '../estilos/detalleCarrito.css';
import { Link, useNavigate } from 'react-router-dom';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import CarritoPDF from '../componentes/CarritoPdf';

// 1. IMPORTAMOS EL CONTEXTO
import { useCarrito } from "../servicios/context/CarritoContext";
import { useAuth } from "../servicios/context/AuthContext";

const DetalleCarrito = () => {
  const navigate = useNavigate();
  const [mostrarPDF, setMostrarPDF] = useState(false);

  // 2. EXTRAEMOS TODO DEL CONTEXTO
  const { carrito, total, agregar, disminuir, vaciar, setTotal, setProductos: setCarritoState } = useCarrito();
  const { user } = useAuth(); // EXTRAEMOS EL USUARIO PARA VERIFICAR SI ESTÁ LOGUEADO
  
  // Mapeamos 'carrito' a 'productos' para no romper tu código de abajo
  const productos = carrito; 
  // Nota: 'setProductos' y 'setTotal' del contexto sirven para actualizar el estado global

  const lista = Array.isArray(productos) ? productos : [];
  const cantidadTotal = lista.reduce((acumulador, item) => acumulador + (item.cantidad || 1), 0);

  

  const handlePurchase = () => {
    if (!user) {
      // Si no está logueado, redirigir al login
      navigate('/iniciar_sesion');
      return;
    }

    const nuevoPedido = {
      id: `SYN-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
      fecha: new Date().toLocaleDateString('es-ES') + ' ' + new Date().toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'}),
      estado: 'EN PROCESO',
      total: Number(total).toLocaleString('es-ES') + ' €',
      items: productos.map(p => ({
          nombre: p.nombre,
          cantidad: p.cantidad || 1
      }))
    };

    const historialPrevio = JSON.parse(localStorage.getItem('historial_synapses') || '[]');
    const nuevoHistorial = [nuevoPedido, ...historialPrevio];
    localStorage.setItem('historial_synapses', JSON.stringify(nuevoHistorial));

    // VACIAR EL CARRITO (esto hará que desaparezcan el badge y el precio del menú)
    vaciar(); 
    
    // Redirigir al perfil
    navigate('/perfil');
  };

  if (lista.length === 0) {
    return (
      <div className="contenedor-carrito-global">
        <div className="carrito-vacio-box">
          <h2 className="brand-label-carrito">SYNAPSES</h2>
          <div className="vacio-info">
            <h3>TU CARRITO ESTÁ VACÍO</h3>
            <p>No has añadido ninguna bicicleta todavía.</p>
            <Link to="/" className="btn-negro-solido" style={{ width: 'auto', display: 'inline-block' }}>VOLVER A LA TIENDA</Link>
          </div>
        </div>
      </div>
    );
  }

  const productosRebajados = lista.filter(p => p.ocasion === true);
  const productosGenerales = lista.filter(p => !p.ocasion);

  const renderItem = (item, index) => { 
    const uniqueKey = item.id ? item.id : `item-${index}`;
    return (
      <div key={uniqueKey} className="carrito-item-row">
        <div className="item-img-wrapper">
           <img 
              src={item.imagen} 
              alt={item.nombre} 
              onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }} 
           />
        </div>
        <div className="item-info-wrapper">
          <div className="item-texts">
              <span className="item-name">{item.nombre}</span>
              <span className="item-cat">{item.categoria || 'Bicicleta'}</span>
          </div>
          <div className="item-actions">
              <div className="controles-minimal">
                  <button onClick={() => disminuir(item)}>-</button>
                  <span>{item.cantidad || 1}</span>
                  <button onClick={() => agregar(item)}>+</button>
              </div>
              <span className="item-price">
                  {(Number(item.precio) * (item.cantidad || 1)).toLocaleString('de-DE')} €
              </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="contenedor-carrito-global">
      <div className="header-pagina-carrito">
        <h2 className="brand-label-carrito">CARRITO DE COMPRA</h2>
        <span className="items-count">{cantidadTotal} ARTÍCULOS</span>
      </div>

      <div className="layout-carrito-split">
        <div className="columna-productos">
          {productosGenerales.length > 0 && (
            <div className="grupo-productos">
              <h3 className="titulo-seccion">MODELOS ESTÁNDAR</h3>
              {productosGenerales.map(renderItem)}
            </div>
          )}
          {productosRebajados.length > 0 && (
            <div className="grupo-productos">
              <h3 className="titulo-seccion rojo">OFERTAS APLICADAS</h3>
              {productosRebajados.map(renderItem)}
            </div>
          )}
          <div className="info-garantia">
            <p>🛡️ <strong>Garantía Oficial:</strong> Todos los modelos incluyen soporte técnico certificado.</p>
          </div>
        </div>

        <div className="columna-resumen">
          <div className="card-resumen-sticky">
            <h3 className="titulo-resumen">RESUMEN DEL PEDIDO</h3>
            <div className="desglose-precios">
              <div className="fila-desglose">
                <span>Subtotal</span>
                <span>{Number(total).toLocaleString('de-DE')} €</span>
              </div>
              <div className="fila-desglose">
                <span>Envío Estimado</span>
                <span className="gratis-txt">GRATIS</span>
              </div>
              <div className="fila-desglose">
                <span>Impuestos (IVA)</span>
                <span>Incluidos</span>
              </div>
            </div>

            <div className="total-final-box">
              <span>TOTAL</span>
              <span className="precio-grande">{Number(total).toLocaleString('de-DE')} €</span>
            </div>

            <div className="acciones-verticales">
              <button 
                className="btn-negro-solido" 
                onClick={handlePurchase}
                style={{ marginBottom: '15px', border: '1px solid #000', cursor: 'pointer' }}
            >
                PAGAR
            </button>

              <button 
                className="btn-negro-solido" 
                onClick={() => setMostrarPDF(true)}
                style={{ opacity: 0.8, fontSize: '0.9rem', cursor: 'pointer' }}
              >
                 PREVISUALIZAR INFORME PDF
              </button>

              <button className="btn-outline-rojo" onClick={vaciar}>
                VACIAR CARRITO
              </button>
            </div>

            <div className="seguridad-logos">
              <small>🔒 Pago 100% Seguro y Encriptado</small>
            </div>
          </div>
        </div>
      </div>

      {mostrarPDF && (
        <div className="pdf-modal-overlay">
          <div className="pdf-modal-content">
            <div className="pdf-modal-header">
              <span className="pdf-modal-title">SYNAPSES // VISTA PREVIA</span>
              <button className="pdf-close-btn" onClick={() => setMostrarPDF(false)}>✕</button>
            </div>
            
            <div className="pdf-viewer-container">
              <PDFViewer width="100%" height="100%" showToolbar={false}>
                 <CarritoPDF productosGenerales={productosGenerales} productosRebajados={productosRebajados} total={total} />
              </PDFViewer>
            </div>

            <div className="pdf-modal-footer">
               <PDFDownloadLink
                  document={<CarritoPDF productosGenerales={productosGenerales} productosRebajados={productosRebajados} total={total} />}
                  fileName="resumen_synapses.pdf"
                  className="btn-download-final"
               >
                  {({ loading }) => loading ? 'GENERANDO...' : 'DESCARGAR ARCHIVO'}
               </PDFDownloadLink>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DetalleCarrito;
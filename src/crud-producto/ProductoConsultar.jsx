import React from 'react';

const ProductoConsultar = ({ producto }) => {
  if (!producto) return null;

  // Calculamos precio con descuento si lo hay
  const tieneDescuento = producto.porcentaje > 0;
  const precioOriginal = Number(producto.precio);
  const precioFinal = tieneDescuento
    ? precioOriginal - (precioOriginal * (producto.porcentaje / 100))
    : precioOriginal;

  // Formato de moneda
  const formatMoney = (amount) => Number(amount).toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

  return (
    <div className="consultar-container">

      <div className="consultar-header-view">
        <div>
          <span className="consultar-id">REF: #{String(producto.id).slice(0, 8).toUpperCase()}</span>
          <h2>{producto.nombre}</h2>
        </div>
        <div className="consultar-badges">
          {tieneDescuento && <span className="view-badge discount">-{producto.porcentaje}% OFF</span>}
          <span className="view-badge category">{producto.categoria}</span>
        </div>
      </div>

      <div className="consultar-body grid-2-col">

        {/* COLUMNA IZQUIERDA: Imagen */}
        <div className="consultar-image-wrapper">
          <img
            src={producto.imagen || "https://via.placeholder.com/300?text=Sin+Imagen"}
            alt={producto.nombre || "Producto"}
            className="consultar-img"
            onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=Error+Imagen"; }}
          />
        </div>

        {/* COLUMNA DERECHA: Detalles */}
        <div className="consultar-details">
          <div className="detail-group">
            <label>Disciplina / Subcategoría</label>
            <p>{producto.subcategoria || producto.categoria || 'N/A'}</p>
          </div>

          <div className="detail-group price-group">
            <label>Precio de Venta</label>
            <div className="consultar-price">
              {tieneDescuento ? (
                <>
                  <span className="price-old">{formatMoney(precioOriginal)} €</span>
                  <span className="price-new">{formatMoney(precioFinal)} €</span>
                </>
              ) : (
                <span className="price-normal">{formatMoney(precioOriginal)} €</span>
              )}
            </div>
          </div>

          <div className="detail-group desc-group full-width-field">
            <label>Descripción Técnica</label>
            <div className="consultar-desc-text">
              {producto.descripcion || "Sin descripción disponible."}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProductoConsultar;
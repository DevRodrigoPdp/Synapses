import React from 'react';

const ProductoConsultar = ({ producto }) => {
  if (!producto) return null;

  return (
    <div style={{ padding: '20px', color: '#000' }}>
      <h2 style={{fontSize: '2rem', marginBottom:'10px'}}>{producto.nombre}</h2>
      
      {/* Añadimos protección por si la imagen viene vacía */}
      <img 
        src={producto.imagen || "https://via.placeholder.com/300?text=Sin+Imagen"} 
        alt={producto.nombre || "Producto"} 
        style={{ width: '100%', maxWidth: '300px', borderRadius: '10px', marginBottom: '20px', objectFit: 'cover' }} 
        // onError para que no se rompa si la URL es mala
        onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=Error+Imagen"; }}
      />

      {/* ID ahora es un número, se muestra igual */}
      <p><strong>ID Ref:</strong> {producto.id}</p>
      
      <p><strong>Categoría:</strong> {producto.categoria}</p>
      
      <p><strong>Precio:</strong> <span style={{color:'green', fontWeight:'bold'}}>{producto.precio} €</span></p>
      
      <p style={{marginTop:'15px'}}><strong>Descripción Técnica:</strong></p>
      <p>{producto.descripcion || "Sin descripción disponible."}</p>
    </div>
  );
};

export default ProductoConsultar;
import React from 'react';
import '../estilos/modal.css'

// Recibe tres props: 
// 1. isOpen: booleano que dice si se ve o no.
// 2. onClose: función para cerrar el modal (cambia el estado en el padre).
// 3. children: todo lo que metas dentro de <Modal>...</Modal> en el padre.
const Modal = ({ isOpen, onClose, children }) => {
  
  // RENDERIZADO CONDICIONAL: 
  // Si 'isOpen' es falso, el componente devuelve 'null' (no dibuja nada en el DOM).
  if (!isOpen) return null;

  return (
    // Capa oscura de fondo que cubre toda la pantalla
    <div className="modal-overlay">
      
      {/* Caja blanca central donde vive el contenido */}
      <div className="modal-content">
        
        {/* Botón de cierre (la X) que ejecuta la función recibida por props */}
        <button className="close-btn" onClick={onClose}>X</button>
        
        {/* Aquí se renderiza dinámicamente lo que le pases: ProductoCrear, Editar, etc. */}
        {children}
        
      </div>
    </div>
  );
};

export default Modal;
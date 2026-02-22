import { useState } from "react";
import '../estilos/administracion.css'
import ProductoBorrar from "../crud-producto/ProductoBorrar.js";
import ProductoConsultar from "../crud-producto/ProductoConsultar.jsx";
import ProductoEditar from "../crud-producto/ProductoEditar.jsx";
import ProductoCrear from "../crud-producto/ProductoCrear.jsx";
import Modal from "../componentes/Modal.jsx";

// 1. IMPORTAMOS EL CONTEXTO
import { useProductos } from "../servicios/context/ProductosContext.jsx";

function Administracion() {
    console.log("Estas dentro de administracion");

    // 2. EXTRAEMOS DATOS Y FUNCIONES DEL CONTEXTO
    // Extraemos 'cargarProductos' para poder refrescar la lista manualmente
    const { productos, loading, eliminarProducto, cargarProductos } = useProductos();

    // Seguridad: Si productos es null, usamos array vacío
    const listaSegura = Array.isArray(productos) ? productos : [];

    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

    const [modals, setModals] = useState({
        crear: false,
        consultar: false,
        editar: false,
    });

    // Función para abrir/cerrar modales
    const gestionarModal = (tipoModal, estadoAbierto) => {
        setModals(prev => ({
            ...prev,
            [tipoModal]: estadoAbierto
        }));

        // Si cerramos (estadoAbierto === false) un modal de CREAR o EDITAR, 
        // refrescamos la lista desde MySQL para asegurar sincronización total.
        if (!estadoAbierto && (tipoModal === 'crear' || tipoModal === 'editar')) {
            cargarProductos();
        }
    };

    const consultarProducto = (producto) => {
        setProductoSeleccionado(producto);
        gestionarModal("consultar", true);
    };

    const editarProductoModal = (producto) => {
        setProductoSeleccionado(producto);
        gestionarModal("editar", true);
    };

    const abrirModalCrear = () => {
        gestionarModal("crear", true);
    };

    const handleClickBorrar = (producto) => {
        // Pasamos: ID, Nombre y la Función del Contexto
        ProductoBorrar(producto.id, producto.nombre, eliminarProducto);
    };

    // Mensaje de carga
    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--text-color)' }}>
                CARGANDO PRODUCTOS DE MYSQL...
            </div>
        );
    }

    return (
        <div className="admin-container">
            <h1 style={{ textAlign: 'center', fontFamily: 'Poppins', fontWeight: '900', fontSize: '2.5rem', marginBottom: '40px', color: 'var(--text-color)' }}>
                PANEL DE CONTROL
            </h1>

            <ul className="productos-list">
                {listaSegura.length > 0 ? (
                    listaSegura.map((producto) => (
                        <li key={producto.id} className="producto-item">
                            <div className="producto-item-header">
                                <strong>{producto.nombre}</strong>
                                <span className="producto-info-extra">
                                    {producto.categoria} // {Number(producto.precio).toLocaleString('de-DE')} €
                                </span>
                            </div>
                            <div className="producto-item-actions">
                                <button onClick={() => consultarProducto(producto)}>VER</button>
                                <button onClick={() => handleClickBorrar(producto)}>ELIMINAR</button>
                                <button onClick={() => editarProductoModal(producto)}>EDITAR</button>
                            </div>
                        </li>
                    ))
                ) : (
                    <p style={{ textAlign: 'center', color: 'var(--text-color)' }}>NO HAY DATOS EN LA BASE DE DATOS.</p>
                )}
            </ul>

            <button className="add-producto-btn" onClick={abrirModalCrear}>
                + NUEVA REFERENCIA
            </button>

            {/* --- MODALES --- */}
            
            <Modal isOpen={modals.crear} onClose={() => gestionarModal("crear", false)}>
                <ProductoCrear onClose={() => gestionarModal("crear", false)} />
            </Modal>

            <Modal isOpen={modals.consultar} onClose={() => gestionarModal("consultar", false)}>
                {productoSeleccionado && <ProductoConsultar producto={productoSeleccionado} />}
            </Modal>

            <Modal isOpen={modals.editar} onClose={() => gestionarModal("editar", false)}>
                {/* Pasamos el objeto del producto seleccionado al componente de editar */}
                <ProductoEditar productos={productoSeleccionado} onClose={() => gestionarModal("editar", false)} />
            </Modal>
        </div>
    );
}

export default Administracion;
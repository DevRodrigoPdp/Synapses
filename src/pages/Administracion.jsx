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
            <div className="admin-header">
                <h1>Panel de Inventario</h1>
                <button className="add-producto-btn" onClick={abrirModalCrear}>
                    <span>+</span> Nuevo Producto
                </button>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>REF</th>
                            <th>PRODUCTO</th>
                            <th className="cell-category">CATEGORÍA</th>
                            <th>PRECIO</th>
                            <th className="cell-stock">ESTADO STOCK</th>
                            <th style={{ textAlign: 'right' }}>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaSegura.length > 0 ? (
                            listaSegura.map((producto) => {
                                // Simulación de stock basado en el ID para demostración
                                // Idealmente esto vendría del producto de la base de datos
                                const randomStock = String(producto.id).charCodeAt(0) % 3;
                                let stockBadge = { class: 'stock-high', text: 'EN STOCK' };
                                if (randomStock === 1) stockBadge = { class: 'stock-medium', text: 'BAJO' };
                                if (randomStock === 2) stockBadge = { class: 'stock-low', text: 'AGOTADO' };

                                return (
                                    <tr key={producto.id}>
                                        <td className="cell-id">#{String(producto.id).slice(0, 8)}</td>
                                        <td>
                                            <div className="cell-product">
                                                <img src={producto.imagen} alt={producto.nombre} className="cell-img" />
                                                <span className="cell-name">{producto.nombre}</span>
                                            </div>
                                        </td>
                                        <td className="cell-category">{producto.categoria}</td>
                                        <td className="cell-price">{Number(producto.precio).toLocaleString('es-ES')} €</td>
                                        <td className="cell-stock">
                                            <span className={`stock-badge ${stockBadge.class}`}>
                                                {stockBadge.text}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="btn-text-action" onClick={() => consultarProducto(producto)}>
                                                    VER
                                                </button>
                                                <button className="btn-text-action" onClick={() => editarProductoModal(producto)}>
                                                    EDITAR
                                                </button>
                                                <button className="btn-text-action delete" onClick={() => handleClickBorrar(producto)}>
                                                    ELIMINAR
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6">
                                    <div className="empty-state-table">
                                        <p>NO HAY DATOS EN LA BASE DE DATOS.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

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
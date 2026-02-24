import React, { useState } from 'react';
// 1. Cambiamos Supabase por el Contexto
import { useProductos } from '../servicios/context/ProductosContext';
import Swal from 'sweetalert2';

// Mantenemos tus props tal cual para no romper nada fuera
const ProductoEditar = ({ productos, onClose }) => {

    // 2. Traemos la función de editar del contexto
    const { editarProducto } = useProductos();

    // Nota: 'productos' aquí trae UN solo producto (según tu código original)
    const producto = productos;

    const [form, setForm] = useState({
        nombre: producto.nombre || '',
        precio: producto.precio || '',
        imagen: producto.imagen || '',
        categoria: producto.categoria || '',
        descripcion: producto.descripcion || '',
        porcentaje: producto.porcentaje || 0
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    // Mantenemos TU validación exacta
    const validateForm = () => {
        const newErrors = {};
        const { nombre, precio, imagen, categoria, descripcion } = form;

        if (!nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
        if (!imagen.trim()) newErrors.imagen = "La URL de la imagen es obligatoria.";
        if (!categoria.trim()) newErrors.categoria = "La categoría es obligatoria.";
        if (!descripcion.trim()) newErrors.descripcion = "La descripción es obligatoria.";

        const precioNumerico = parseFloat(precio);
        if (!precio || isNaN(precioNumerico) || precioNumerico <= 0) {
            newErrors.precio = "Introduce un precio numérico mayor a 0.";
        }

        const porcentajeNum = parseFloat(form.porcentaje);
        if (isNaN(porcentajeNum) || porcentajeNum < 0 || porcentajeNum > 100) {
            newErrors.porcentaje = "El porcentaje debe estar entre 0 y 100.";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formErrors = validateForm();

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        // 3. Preparamos el objeto para JAVA
        const precioFinal = parseFloat(form.precio);

        const datosActualizados = {
            id: producto.id, // ¡IMPORTANTE! Java necesita el ID para saber cuál editar
            nombre: form.nombre.trim(),
            precio: precioFinal,
            imagen: form.imagen.trim(),
            categoria: form.categoria.trim(),
            descripcion: form.descripcion.trim(),
            ocasion: parseFloat(form.porcentaje) > 0,
            porcentaje: parseFloat(form.porcentaje)
        };

        try {
            // 4. Llamamos a Java a través del Contexto
            const exito = await editarProducto(datosActualizados);

            if (exito) {
                // Mensaje de éxito (Mantenemos tu Swal)
                Swal.fire({
                    icon: 'success',
                    title: 'Actualizado',
                    text: 'Producto modificado correctamente en la base de datos',
                    timer: 1500,
                    showConfirmButton: false
                });

                onClose(); // Cerramos el modal
            } else {
                throw new Error("Fallo al actualizar en el backend");
            }

        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Error al conectar con el servidor Java', 'error');
        }
    };

    const errorStyle = {
        color: 'red',
        fontSize: '0.85rem',
        marginTop: '5px',
        display: 'block'
    };

    return (
        <div className="form-container">
            <h2>Editar: {producto.nombre}</h2>

            <form onSubmit={handleSubmit} noValidate>
                <div className="form-grid-modal">
                    {/* NOMBRE */}
                    <div>
                        <label>Nombre del Producto</label>
                        <input
                            type="text"
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            style={errors.nombre ? { borderColor: 'red' } : {}}
                        />
                        {errors.nombre && <span style={errorStyle}>{errors.nombre}</span>}
                    </div>

                    {/* CATEGORÍA */}
                    <div>
                        <label>Categoría</label>
                        <input
                            type="text"
                            name="categoria"
                            value={form.categoria}
                            onChange={handleChange}
                            style={errors.categoria ? { borderColor: 'red' } : {}}
                        />
                        {errors.categoria && <span style={errorStyle}>{errors.categoria}</span>}
                    </div>

                    {/* PRECIO */}
                    <div>
                        <label>Precio (€)</label>
                        <input
                            type="number"
                            name="precio"
                            value={form.precio}
                            onChange={handleChange}
                            style={errors.precio ? { borderColor: 'red' } : {}}
                        />
                        {errors.precio && <span style={errorStyle}>{errors.precio}</span>}
                    </div>

                    {/* PORCENTAJE DESCUENTO */}
                    <div>
                        <label>Descuento (%)</label>
                        <input
                            type="number"
                            name="porcentaje"
                            value={form.porcentaje}
                            onChange={handleChange}
                            min="0"
                            max="100"
                            style={errors.porcentaje ? { borderColor: 'red' } : {}}
                        />
                        {errors.porcentaje && <span style={errorStyle}>{errors.porcentaje}</span>}
                    </div>

                    {/* IMAGEN */}
                    <div className="full-width-field">
                        <label>URL de la Imagen</label>
                        <input
                            type="text"
                            name="imagen"
                            value={form.imagen}
                            onChange={handleChange}
                            style={errors.imagen ? { borderColor: 'red' } : {}}
                        />
                        {errors.imagen && <span style={errorStyle}>{errors.imagen}</span>}
                    </div>

                    {/* DESCRIPCIÓN */}
                    <div className="full-width-field">
                        <label>Descripción Técnica</label>
                        <textarea
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                            rows="4"
                            style={errors.descripcion ? { borderColor: 'red' } : {}}
                        ></textarea>
                        {errors.descripcion && <span style={errorStyle}>{errors.descripcion}</span>}
                    </div>
                </div>

                <div className="form-actions-modal">
                    <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
                    <button type="submit" className="btn-save">Actualizar Producto</button>
                </div>
            </form>
        </div>
    );
};

export default ProductoEditar;
import React, { useState } from 'react';
// 1. Quitamos Supabase e importamos el Hook de tu contexto
import { useProductos } from '../servicios/context/ProductosContext'; // <--- AJUSTA LA RUTA SI ES NECESARIO
import Swal from 'sweetalert2';
import '../estilos/administracion.css';

const ProductoCrear = ({ onClose }) => {
    // 2. Sacamos la función 'crearProducto' del contexto
    // Nota: Ya no necesitamos 'setProductos' por props, el contexto lo hace solo.
    const { crearProducto } = useProductos();

    const [form, setForm] = useState({
        nombre: '',
        precio: '',
        imagen: '',
        categoria: 'Bicicleta',
        subcategoria: '',
        descripcion: '',
        porcentaje: 0
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const validate = () => {
        let newErrors = {};

        if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
        if (!form.imagen.trim()) newErrors.imagen = "La URL de la imagen es obligatoria.";
        if (!form.categoria.trim()) newErrors.categoria = "La categoría es obligatoria.";

        // La subcategoría solo es obligatoria si es una Bicicleta (opcional)
        // Pero por consistencia, la pedimos siempre si deciden usarla
        if (!form.subcategoria.trim() && form.categoria === 'Bicicleta') {
            newErrors.subcategoria = "La disciplina es obligatoria para bicicletas.";
        }

        if (!form.descripcion.trim()) newErrors.descripcion = "La descripción es obligatoria.";

        const precioNum = parseFloat(form.precio);
        if (!form.precio || isNaN(precioNum) || precioNum <= 0) {
            newErrors.precio = "El precio debe ser un número mayor a 0.";
        }

        const porcentajeNum = parseFloat(form.porcentaje);
        if (isNaN(porcentajeNum) || porcentajeNum < 0 || porcentajeNum > 100) {
            newErrors.porcentaje = "El porcentaje debe estar entre 0 y 100.";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formErrors = validate();

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        // 3. Preparamos el objeto PARA JAVA/SUPABASE
        const nuevoProducto = {
            nombre: form.nombre.trim(),
            precio: parseFloat(form.precio),
            imagen: form.imagen.trim(),
            categoria: form.categoria.trim(),
            subcategoria: form.subcategoria.trim(), // <- NUEVO CAMPO
            descripcion: form.descripcion.trim(),
            ocasion: parseFloat(form.porcentaje) > 0,
            porcentaje: parseFloat(form.porcentaje)
        };

        try {
            // 4. Llamamos a la función de tu Contexto (que conecta con Axios/Java)
            const exito = await crearProducto(nuevoProducto);

            if (exito) {
                Swal.fire({
                    icon: 'success',
                    title: 'Producto guardado en MySQL',
                    showConfirmButton: false,
                    timer: 1500
                });
                onClose(); // Cerramos el modal
            } else {
                // Si crearProducto devuelve false es que falló algo en Java
                throw new Error("Error al guardar en el backend");
            }

        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'No se pudo conectar con el servidor Java', 'error');
        }
    };

    const errorMsgStyle = {
        color: 'red',
        fontSize: '12px',
        marginTop: '4px',
        display: 'block'
    };

    return (
        <div className="form-container">
            <h2>Nuevo Producto (MySQL)</h2>
            <form onSubmit={handleSubmit} noValidate>
                <div className="form-grid-modal">
                    {/* NOMBRE */}
                    <div>
                        <label>Nombre del Producto</label>
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Ej: Casco Aero Ultra"
                            onChange={handleChange}
                            value={form.nombre}
                            style={errors.nombre ? { borderColor: 'red' } : {}}
                        />
                        {errors.nombre && <span style={errorMsgStyle}>{errors.nombre}</span>}
                    </div>

                    {/* CATEGORÍA PRINCIPAL */}
                    <div>
                        <label>Categoría General</label>
                        <select
                            name="categoria"
                            value={form.categoria}
                            onChange={handleChange}
                            style={errors.categoria ? { borderColor: 'red' } : {}}
                            className="select-form"
                        >
                            <option value="">Selecciona...</option>
                            <option value="Bicicleta">Bicicletas</option>
                            <option value="Equipamiento">Equipamiento</option>
                            <option value="Componentes">Componentes</option>
                        </select>
                        {errors.categoria && <span style={errorMsgStyle}>{errors.categoria}</span>}
                    </div>

                    {/* SUBCATEGORÍA / TIPO */}
                    <div>
                        <label>Disciplina / Subcategoría</label>
                        <select
                            name="subcategoria"
                            value={form.subcategoria}
                            onChange={handleChange}
                            style={errors.subcategoria ? { borderColor: 'red' } : {}}
                            className="select-form"
                            disabled={!form.categoria} // Deshabilitar si no hay categoría seleccionada
                        >
                            <option value="">
                                {!form.categoria ? 'Selecciona primero una categoría...' : 'Selecciona el tipo exacto...'}
                            </option>

                            {form.categoria === 'Bicicleta' && (
                                <optgroup label="Bicicletas">
                                    <option value="Bicicleta de Montaña">Bicicleta de Montaña (MTB)</option>
                                    <option value="E-MTB">E-MTB (Eléctrica)</option>
                                    <option value="Bicicleta de Carretera">Bicicleta de Carretera</option>
                                    <option value="Gravel">Gravel</option>
                                    <option value="Enduro">Enduro / Descenso</option>
                                    <option value="Urbana">Urbana / Fixie</option>
                                </optgroup>
                            )}

                            {form.categoria === 'Equipamiento' && (
                                <optgroup label="Equipamiento Base">
                                    <option value="Cascos">Cascos</option>
                                    <option value="Guantes">Guantes</option>
                                    <option value="Protecciones">Protecciones</option>
                                    <option value="Gafas">Gafas</option>
                                </optgroup>
                            )}

                            {form.categoria === 'Componentes' && (
                                <optgroup label="Componentes">
                                    <option value="Cubiertas">Cubiertas</option>
                                    <option value="Accesorios">Accesorios Generales</option>
                                </optgroup>
                            )}
                        </select>
                        {errors.subcategoria && <span style={errorMsgStyle}>{errors.subcategoria}</span>}
                    </div>

                    {/* PRECIO */}
                    <div>
                        <label>Precio (€)</label>
                        <input
                            type="number"
                            name="precio"
                            placeholder="0.00"
                            onChange={handleChange}
                            value={form.precio}
                            style={errors.precio ? { borderColor: 'red' } : {}}
                        />
                        {errors.precio && <span style={errorMsgStyle}>{errors.precio}</span>}
                    </div>

                    {/* PORCENTAJE DESCUENTO */}
                    <div>
                        <label>Descuento (%)</label>
                        <input
                            type="number"
                            name="porcentaje"
                            placeholder="0 para no rebajado"
                            onChange={handleChange}
                            value={form.porcentaje}
                            min="0"
                            max="100"
                            style={errors.porcentaje ? { borderColor: 'red' } : {}}
                        />
                        {errors.porcentaje && <span style={errorMsgStyle}>{errors.porcentaje}</span>}
                    </div>

                    {/* IMAGEN */}
                    <div className="full-width-field">
                        <label>URL de la Imagen</label>
                        <input
                            type="text"
                            name="imagen"
                            placeholder="https://ejemplo.com/imagen.jpg"
                            onChange={handleChange}
                            value={form.imagen}
                            style={errors.imagen ? { borderColor: 'red' } : {}}
                        />
                        {errors.imagen && <span style={errorMsgStyle}>{errors.imagen}</span>}
                    </div>

                    {/* DESCRIPCIÓN */}
                    <div className="full-width-field">
                        <label>Descripción Técnica</label>
                        <textarea
                            name="descripcion"
                            placeholder="Detalles sobre materiales, uso recomendado, etc."
                            onChange={handleChange}
                            value={form.descripcion}
                            rows="4"
                            style={errors.descripcion ? { borderColor: 'red' } : {}}
                        ></textarea>
                        {errors.descripcion && <span style={errorMsgStyle}>{errors.descripcion}</span>}
                    </div>
                </div>

                <div className="form-actions-modal">
                    <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
                    <button type="submit" className="btn-save">Guardar Producto</button>
                </div>
            </form>
        </div>
    );
};

export default ProductoCrear;
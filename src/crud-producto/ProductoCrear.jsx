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
        categoria: 'Bicicleta de Montaña',
        descripcion: ''
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
        if (!form.descripcion.trim()) newErrors.descripcion = "La descripción es obligatoria.";

        const precioNum = parseFloat(form.precio);
        if (!form.precio || isNaN(precioNum) || precioNum <= 0) {
            newErrors.precio = "El precio debe ser un número mayor a 0.";
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

        // 3. Preparamos el objeto PARA JAVA
        const nuevoProducto = {
            nombre: form.nombre.trim(),
            precio: parseFloat(form.precio),
            imagen: form.imagen.trim(),
            categoria: form.categoria.trim(),
            descripcion: form.descripcion.trim(),
            ocasion: false,
            porcentaje: 0.0 // Añado esto por si en Java lo tienes como Double no nulo
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
                
                {/* NOMBRE */}
                <div style={{ marginBottom: '10px' }}>
                    <input 
                        type="text" 
                        name="nombre" 
                        placeholder="Nombre Modelo" 
                        onChange={handleChange} 
                        value={form.nombre}
                        style={errors.nombre ? { borderColor: 'red' } : {}}
                    />
                    {errors.nombre && <span style={errorMsgStyle}>{errors.nombre}</span>}
                </div>

                {/* PRECIO */}
                <div style={{ marginBottom: '10px' }}>
                    <input 
                        type="number" 
                        name="precio" 
                        placeholder="Precio (€)" 
                        onChange={handleChange} 
                        value={form.precio}
                        style={errors.precio ? { borderColor: 'red' } : {}}
                    />
                    {errors.precio && <span style={errorMsgStyle}>{errors.precio}</span>}
                </div>

                {/* IMAGEN */}
                <div style={{ marginBottom: '10px' }}>
                    <input 
                        type="text" 
                        name="imagen" 
                        placeholder="URL de la imagen" 
                        onChange={handleChange} 
                        value={form.imagen}
                        style={errors.imagen ? { borderColor: 'red' } : {}}
                    />
                    {errors.imagen && <span style={errorMsgStyle}>{errors.imagen}</span>}
                </div>

                {/* CATEGORÍA */}
                <div style={{ marginBottom: '10px' }}>
                    <input 
                        type="text" 
                        name="categoria" 
                        placeholder="Categoría" 
                        value={form.categoria} 
                        onChange={handleChange} 
                        style={errors.categoria ? { borderColor: 'red' } : {}}
                    />
                    {errors.categoria && <span style={errorMsgStyle}>{errors.categoria}</span>}
                </div>

                {/* DESCRIPCIÓN */}
                <div style={{ marginBottom: '10px' }}>
                    <textarea 
                        name="descripcion" 
                        placeholder="Descripción técnica" 
                        onChange={handleChange}
                        value={form.descripcion}
                        style={errors.descripcion ? { borderColor: 'red' } : {}}
                    ></textarea>
                    {errors.descripcion && <span style={errorMsgStyle}>{errors.descripcion}</span>}
                </div>
                
                <div className="form-actions">
                    <button type="submit" className="btn-save">Guardar en Base de Datos</button>
                    <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default ProductoCrear;
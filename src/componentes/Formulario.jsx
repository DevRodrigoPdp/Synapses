import React, { useState } from "react";
import "../estilos/formulario.css"; // CSS separado para evitar conflictos

function Formulario() {
  const [errores, setErrores] = useState({});
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    imagen: "",
    categoria: "",
  });

  const gestionarCambio = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
    if (!form.imagen.trim()) nuevosErrores.imagen = "La imagen es obligatoria";
    if (!form.precio.trim()) nuevosErrores.precio = "El precio es obligatorio";
    if (form.categoria && (form.categoria.length < 10 || form.categoria.length > 100))
      nuevosErrores.categoria = "La categoría/descripción debe tener entre 10 y 100 caracteres";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const enviarFormulario = (e) => {
    e.preventDefault();
    if (validar()) {
      console.clear();
      console.log("Formulario Enviado", form);
    }
  };

  return (
    <div className="prod-container">
       {/* Panel izquierdo: Imagen */}
      <div className="prod-right"></div>
      <div className="prod-left">
        <div className="prod-header">
          <h2 className="prod-animation prod-a1">Agregar Nuevo Producto</h2>
          <h4 className="prod-animation prod-a2">
            Completa los detalles del producto para la tienda.
          </h4>
        </div>
        <form className="prod-form" onSubmit={enviarFormulario}>
          <input
            id="nombre"
            type="text"
            name="nombre"
            className="prod-form-field prod-animation prod-a3"
            value={form.nombre}
            onChange={gestionarCambio}
            placeholder="Nombre del Producto"
          />
          {errores.nombre && <p className="prod-error">{errores.nombre}</p>}

          <input
            id="precio"
            type="text"
            name="precio"
            className="prod-form-field prod-animation prod-a4"
            value={form.precio}
            onChange={gestionarCambio}
            placeholder="Precio (ej: 49.99)"
          />
          {errores.precio && <p className="prod-error">{errores.precio}</p>}

          <input
            id="imagen"
            type="text"
            name="imagen"
            className="prod-form-field prod-animation prod-a5"
            value={form.imagen}
            onChange={gestionarCambio}
            placeholder="URL de la Imagen"
          />
          {errores.imagen && <p className="prod-error">{errores.imagen}</p>}

          <input
            id="categoria"
            type="text"
            name="categoria"
            className="prod-form-field prod-animation prod-a6"
            value={form.categoria}
            onChange={gestionarCambio}
            placeholder="Categoría o Descripción (10-100 chars)"
          />
          {errores.categoria && <p className="prod-error">{errores.categoria}</p>}

          <button type="submit" className="prod-animation prod-a7 prod-color">
            Enviar Producto
          </button>
        </form>
      </div>
      
    </div>
  );
}

export default Formulario;

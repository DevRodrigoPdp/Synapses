import Swal from "sweetalert2";

// Ahora la función recibe el ID y la función del contexto para eliminar
const ProductoBorrar = async (id, nombre, eliminarProductoContext) => {
  
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: `Vas a eliminar: ${nombre}`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    try {
        // Llamamos a la función de Java a través del contexto
        const exito = await eliminarProductoContext(id);

        if (exito) {
            Swal.fire("Eliminado", "El producto ha sido borrado de la base de datos.", "success");
        } else {
            throw new Error("Error en el backend");
        }

    } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo eliminar el producto.", "error");
    }
  }
};

export default ProductoBorrar;
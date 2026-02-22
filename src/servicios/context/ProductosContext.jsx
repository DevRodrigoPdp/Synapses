import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase'; // Importamos el cliente de Supabase

const ProductosContext = createContext();

export const useProductos = () => {
    const context = useContext(ProductosContext);
    if (!context) throw new Error("useProductos debe usarse dentro de ProductosProvider");
    return context;
};

export const ProductosProvider = ({ children }) => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Función para recargar productos (conectada a Supabase)
    const cargarProductos = async () => {
        setLoading(true);
        try {
            // Hacemos el SELECT a la tabla "productos"
            const { data, error } = await supabase
                .from('productos')
                .select('*')
                .order('id', { ascending: true }); // Opcional, ordena por ID

            if (error) {
                throw error;
            }

            setProductos(data || []); 
            console.log("✅ Productos cargados desde Supabase:", data);
            
        } catch (error) {
            console.error("❌ Error conectando con Supabase:", error);
        } finally {
            setLoading(false);
        }
    };

    // Función para CREAR un producto nuevo (POST) en Supabase
    const crearProducto = async (nuevoProducto) => {
        setLoading(true);
        try {
            // Insertamos los datos generados sin el id ni created_at
            const { data, error } = await supabase
                .from('productos')
                .insert([nuevoProducto])
                .select()
                .single(); // Pedimos que devuelva el objeto insertado único

            if (error) {
                throw error;
            }

            // Actualizamos la lista visualmente añadiendo el nuevo al final
            setProductos(prev => [...prev, data]);
            
            console.log("✅ Producto guardado en Supabase:", data);
            return true; // Éxito
        } catch (error) {
            console.error("❌ Error guardando producto en Supabase:", error);
            return false; // Fallo
        } finally {
            setLoading(false);
        }
    };

    const editarProducto = async (productoActualizado) => {
        setLoading(true); // Bloqueamos la pantalla para evitar ediciones dobles
        try {
            // Hacemos el UPDATE basándonos en el ID
            const { data, error } = await supabase
                .from('productos')
                .update(productoActualizado)
                .eq('id', productoActualizado.id)
                .select()
                .single();

            if (error) {
                throw error;
            }

            // Actualizamos el estado local
            setProductos(prevProductos => {
                return prevProductos.map(p => 
                    p.id === productoActualizado.id ? { ...p, ...data } : p
                );
            });
            console.log("✅ Producto editado con éxito en Supabase:", data);
            return true;
        } catch (error) {
            console.error("❌ Error al editar en Supabase:", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const eliminarProducto = async (id) => {
        try {
            const { error } = await supabase
                .from('productos')
                .delete()
                .eq('id', id);

            if (error) {
                throw error;
            }
            
            // Actualizamos la lista visualmente quitando el que tenga ese ID
            setProductos(prev => prev.filter(producto => producto.id !== id));
            return true;
        } catch (error) {
            console.error("❌ Error eliminando en Supabase:", error);
            return false;
        }
    };

    // Carga inicial
    useEffect(() => {
        cargarProductos();
    }, []);

    const value = {
        productos,      
        setProductos,   
        loading,        
        cargarProductos,
        editarProducto,
        eliminarProducto,
        crearProducto
    };

    return (
        <ProductosContext.Provider value={value}>
            {children}
        </ProductosContext.Provider>
    );
};
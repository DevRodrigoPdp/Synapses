import React, { createContext, useContext, useState, useEffect } from 'react';

const CarritoContext = createContext();

export const useCarrito = () => {
    const context = useContext(CarritoContext);
    if (!context) throw new Error("useCarrito debe usarse dentro de CarritoProvider");
    return context;
};

export const CarritoProvider = ({ children }) => {
    // Inicializamos con lo que haya en LocalStorage para no perder el carrito al refrescar
    const [carrito, setCarrito] = useState(() => {
        const guardado = localStorage.getItem("synapses_carrito");
        return guardado ? JSON.parse(guardado) : [];
    });

    const [total, setTotal] = useState(0);

    // Cada vez que cambie el carrito, guardamos en localStorage y recalculamos total
    useEffect(() => {
        localStorage.setItem("synapses_carrito", JSON.stringify(carrito));
        
        // Calcular total
        const nuevoTotal = carrito.reduce((acc, item) => {
            return acc + (Number(item.precio) * (item.cantidad || 1));
        }, 0);
        setTotal(nuevoTotal);
    }, [carrito]);

    // --- FUNCIONES DE LÓGICA (Integradas aquí) ---

    const agregar = (item) => {
        const nuevaLista = [...carrito];
        const index = nuevaLista.findIndex(p => p.nombre === item.nombre);

        if (index !== -1) {
            nuevaLista[index].cantidad = (nuevaLista[index].cantidad || 1) + 1;
        } else {
            nuevaLista.push({ ...item, cantidad: 1 });
        }
        setCarrito(nuevaLista);
    };

    const disminuir = (item) => {
        const nuevaLista = [...carrito];
        const index = nuevaLista.findIndex(p => p.nombre === item.nombre);

        if (index !== -1) {
            const producto = nuevaLista[index];
            if (producto.cantidad > 1) {
                producto.cantidad -= 1;
            } else {
                nuevaLista.splice(index, 1);
            }
            setCarrito(nuevaLista);
        }
    };

    const vaciar = () => {
        setCarrito([]);
    };

    const value = {
        carrito,    // Lista de items COMPRADOS (no confundir con catálogo)
        total,
        agregar,
        disminuir,
        vaciar
    };

    return (
        <CarritoContext.Provider value={value}>
            {children}
        </CarritoContext.Provider>
    );
};
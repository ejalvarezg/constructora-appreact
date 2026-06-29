// src/context/CartContext.jsx
import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);

    // Verifica si el servicio ya fue añadido
    const isInCart = (id) => {
        return serviciosSeleccionados.some(item => item.id === id);
    };

    // No duplicar servicios en el presupuesto
    const agregarServicio = (servicio) => {
        const yaExiste = isInCart(servicio.id);

        if (!yaExiste) {
            // Agregar servicio al presupuesto
            setServiciosSeleccionados([...serviciosSeleccionados, servicio]);
        }
    };

    // Eliminar servicio del presupuesto
    const eliminarServicio = (id) => {
        setServiciosSeleccionados(serviciosSeleccionados.filter(item => item.id !== id));
    };

    // Vaciar carrito
    const vaciarCarrito = () => {
        setServiciosSeleccionados([]);
    };

    return (
        <CartContext.Provider value={{ serviciosSeleccionados, agregarServicio, eliminarServicio, vaciarCarrito, isInCart }}>
            {children}
        </CartContext.Provider>
    );
}
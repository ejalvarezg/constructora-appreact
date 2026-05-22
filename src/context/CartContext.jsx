// src/context/CartContext.jsx
import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);

    // No duplicar servicios en el presupuesto
    const agregarServicio = (servicio) => {
        const yaExiste = serviciosSeleccionados.some(item => item.id === servicio.id);

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
        <CartContext.Provider value={{ serviciosSeleccionados, agregarServicio, eliminarServicio, vaciarCarrito }}>
            {children}
        </CartContext.Provider>
    );
}
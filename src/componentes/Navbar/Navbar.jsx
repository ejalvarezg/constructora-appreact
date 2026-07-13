// src/componentes/Navbar/Navbar.jsx
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import styles from './Navbar.module.css';

export function Navbar() {
    // Acceso al contexto para obtener el estado del carrito
    const { serviciosSeleccionados } = useContext(CartContext);

    // Estado para controlar la visibilidad del menú colapsable en móviles
    const [menuAbierto, setMenuAbierto] = useState(false);

    return (
        <nav className={styles.navegacion}>
            {/* Botón hamburguesa para móviles */}
            <button
                className={`${styles.botonHamburguesa} ${menuAbierto ? styles.hamburguesaActiva : ''}`}
                onClick={() => setMenuAbierto(!menuAbierto)}
                aria-label="Menú de navegación"
            >
                <span className={styles.linea}></span>
                <span className={styles.linea}></span>
                <span className={styles.linea}></span>
            </button>

            {/* Lista de enlaces de navegación, con clase condicional para mostrar/ocultar en móviles */}
            <ul className={`${styles.listaEnlaces} ${menuAbierto ? styles.menuDesplegado : ''}`}>
                {/* Inicio */}
                <li>
                    <Link to="/" className={styles.enlace} onClick={() => setMenuAbierto(false)}>
                        Inicio
                    </Link>
                </li>

                {/* Rubros y Servicios */}
                <li>
                    <Link to="/servicios" className={styles.enlace} onClick={() => setMenuAbierto(false)}>
                        Servicios
                    </Link>
                </li>

                {/* Panel de gestión */}
                <li>
                    <Link to="/gestion" className={styles.enlace} onClick={() => setMenuAbierto(false)}>
                        Panel Admin
                    </Link>
                </li>

                {/* Mi Presupuesto */}
                <li>
                    <Link to="/carrito" className={styles.enlaceCarrito} onClick={() => setMenuAbierto(false)}>
                        <span className={styles.icono}>📋</span>
                        <span className={styles.textoBoton}>Mi Presupuesto</span>

                        {/* Contador de servicios en el carrito */}
                        {serviciosSeleccionados.length > 0 && (
                            <span className={styles.badgeContador}>
                                {serviciosSeleccionados.length}
                            </span>
                        )}
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
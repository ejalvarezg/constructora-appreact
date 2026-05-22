// src/componentes/ServicioCard/ServicioCard.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import styles from './ServicioCard.module.css';

export function ServicioCard({ servicio }) {
    // Ruta guardada en variable
    const rutaDestino = `/servicio/${servicio.id}`;

    // Acceso a la función de agregar servicio desde el contexto del carrito
    const { serviciosSeleccionados, agregarServicio } = useContext(CartContext);

    const yaAgregado = serviciosSeleccionados.some(item => item.id === servicio.id);

    return (
        <div className={styles.tarjeta}>
            <Link to={rutaDestino} className={styles.enlaceContenedorImagen}>
                <div className={styles.contenedorImagen}>
                    <img
                        src={servicio.imagen}
                        alt={`Ficha de obra: ${servicio.nombre}`}
                        className={styles.imagen}
                    />
                    <span className={styles.etiquetaAlcance}>{servicio.alcance}</span>
                </div>
            </Link>

            <div className={styles.cuerpo}>
                <span className={styles.categoria}>{servicio.categoria}</span>
                <h3 className={styles.nombre}>
                    <Link to={rutaDestino} className={styles.enlaceNombre}>
                        {servicio.nombre}
                    </Link>
                </h3>
                <p className={styles.resumen}>{servicio.descripcion_corta}</p>

                {/* Contenedor de acciones: enlace a detalles y botón de agregar al carrito */}
                <div className={styles.acciones}>
                    {/* Enlace dinámico utilizando la variable de ruta */}
                    <Link to={rutaDestino} className={styles.enlaceServicio}>
                        Ver detalles <span>→</span>
                    </Link>

                    {/* Botón directo para añadir el servicio a presupuestar */}
                    <button 
                        type="button" 
                        className={`${styles.botonAgregar} ${yaAgregado ? styles.botonAgregado : ''}`}
                        onClick={() => agregarServicio(servicio)}
                        disabled={yaAgregado}
                    >
                        {yaAgregado ? 'Añadido ✓' : 'Añadir ＋'}
                    </button>
                </div>
            </div>
        </div>
    );
}
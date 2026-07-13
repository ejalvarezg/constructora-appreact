// src/componentes/Spinner/Spinner.jsx
import React from 'react';
import styles from './Spinner.module.css';

export function Spinner({ mensaje = "Cargando información..." }) {
    return (
        <div className={styles.contenedorSpinner}>
            <div className={styles.ruedaAnimada}></div>
            <p className={styles.textoMensaje}>{mensaje}</p>
        </div>
    );
}
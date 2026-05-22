// src/componentes/TarjetasMiembros/TarjetasMiembros.jsx
import React from 'react';
import styles from './TarjetasMiembros.module.css';

export function TarjetasMiembros({ nombre, puesto, matricula, imagen }) {
    return (
        <div className={styles.tarjeta}>
            <div className={styles.contenedorImagen}>
                {imagen ? (
                    <img 
                        src={imagen} 
                        alt={`Foto de ${nombre}`} 
                        className={styles.fotoPerfil} 
                    />
                ) : (
                    <div className={styles.avatarLetra}>
                        <span className={styles.inicial}>{nombre.charAt(0)}</span>
                    </div>
                )}
            </div>
            
            <div className={styles.info}>
                <h4 className={styles.nombre}>{nombre}</h4>
                <p className={styles.puesto}>{puesto}</p>
                {matricula && (
                    <span className={styles.matricula}>Mat.: {matricula}</span>
                )}
            </div>
        </div>
    );
}
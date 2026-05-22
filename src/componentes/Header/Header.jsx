// src/componentes/Header/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../Navbar/Navbar';
import styles from './Header.module.css';

export function Header() {
    return (
        <header className={styles.headerGlobal}>
            <div className={styles.contenedorMarca}>
                {/* El logo redirige a Inicio */}
                <Link to="/" className={styles.logoEnlace}>
                    <img 
                        src="/brand/logo.png" 
                        alt="Logotipo Constructora Bricks" 
                        className={styles.imagenLogo} 
                    />
                    <div className={styles.bloqueTexto}>
                        <h1 className={styles.razonSocial}>Constructora Bricks</h1>
                        <span className={styles.subtitulo}>Soluciones Edilicias</span>
                    </div>
                </Link>
            </div>

            {/* Barra de navegación */}
            <Navbar />
        </header>
    );
}
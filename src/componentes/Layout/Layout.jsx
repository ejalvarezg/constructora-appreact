// src/componentes/Layout/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import styles from './Layout.module.css';

export function Layout() {
    return (
        <div className={styles.layoutGlobal}>
            <Header />
            
            <main className={styles.areaContenido}>
                <div className={styles.limiteAncho}>
                    {/* Componente Outlet para renderizar el contenido de las rutas hijas */}
                    <Outlet />
                </div>
            </main>
            
            <Footer />
        </div>
    );
}
// src/paginas/Servicios/Servicios.jsx
import React, { useState, useEffect } from 'react';
import { ServicioCard } from '../../componentes/ServicioCard/ServicioCard';
import styles from './Servicios.module.css';

export function Servicios() {
    const [listaServicios, setListaServicios] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        fetch('/data/servicios.json')
            .then(respuesta => {
                if (!respuesta.ok) {
                    throw new Error('Error al intentar obtener los servicios disponibles.');
                }
                return respuesta.json();
            })
            .then(data => setListaServicios(data))
            .catch(error => console.error("Error en catálogo:", error))
            .finally(() => setCargando(false));
    }, []);

    return (
        <div className={styles.contenedor}>
            <div className={styles.encabezadoSeccion}>
                <h2 className={styles.titulo}>Nuestros servicios</h2>
                <p className={styles.bajada}>
                    Contamos con un equipo técnico calificado para cada área de mantenimiento y refacción de su inmueble. Ya sea que necesite resolver filtraciones, instalaciones de servicios (plomería, gas, electricidad), trabajos en herrería y carpintería, o renovaciones estéticas de pintura en interior o exterior, aquí puede centralizar su solicitud. Añada los servicios que necesite al presupuesto.
                </p>
            </div>

            {cargando ? (
                <div className={styles.precarga}>
                    <p>Sincronizando registros con el servidor...</p>
                </div>
            ) : (
                <div className={styles.grilla}>
                    {listaServicios.map((servicio) => (
                        <ServicioCard key={servicio.id} servicio={servicio} />
                    ))}
                </div>
            )}
        </div>
    );
}
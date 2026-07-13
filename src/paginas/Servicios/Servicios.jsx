// src/paginas/Servicios/Servicios.jsx
import React, { useState, useEffect } from 'react';
import { ServicioCard } from '../../componentes/ServicioCard/ServicioCard';
import styles from './Servicios.module.css';

// --- IMPORTACIÓN DE FIREBASE ----------------------------
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
// --------------------------------------------------------

export function Servicios() {
    const [listaServicios, setListaServicios] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        // --- Firebase en lugar de fetch local ---
        // Busca en la base de datos la colección que llamada 'servicios'
        const serviciosCollection = collection(db, "servicios");

        // Obtiene los documentos de la colección y los mapea a un arreglo de objetos
        getDocs(serviciosCollection)
            .then((respuesta) => {
                const serviciosLimpios = respuesta.docs.map((doc) => ({
                    // Extrae los datos del documento y agrega el ID del documento como propiedad
                    ...doc.data(),
                    id: doc.id
                }));
                // Actualiza el estado con la lista de servicios obtenida de Firebase
                setListaServicios(serviciosLimpios);
            })
            // Captura cualquier error que ocurra durante la obtención de los documentos y lo registra en la consola
            .catch((error) => console.error("Error en catálogo (Firebase):", error))
            // Deja de cargar para mostrar los servicios o el mensaje de error
            .finally(() => setCargando(false));
        // -----------------------------------------------

    }, []);

    // Renderizado condicional: mensaje de carga mientras se obtienen los servicios, o la lista de servicios en tarjetas
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
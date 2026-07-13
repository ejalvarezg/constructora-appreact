// src/paginas/Gestion/Gestion.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import styles from './Gestion.module.css';

export function Gestion() {
    const [servicios, setServicios] = useState([]);
    const [cargando, setCargando] = useState(true);

    // Función para leer los datos de Firebase (Read)
    const cargarServicios = () => {
        setCargando(true);
        const serviciosCollection = collection(db, "servicios");
        getDocs(serviciosCollection)
            .then((respuesta) => {
                const lista = respuesta.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setServicios(lista);
            })
            .catch(error => console.error("Error al cargar servicios:", error))
            .finally(() => setCargando(false));
    };

    // Ejecuta la carga al montar el componente
    useEffect(() => {
        cargarServicios();
    }, []);

    // Función para borrar un registro de Firebase (Delete)
    const eliminarServicio = async (id, nombre) => {
        const confirmar = window.confirm(`¿Estás seguro de que deseas eliminar permanentemente el servicio: "${nombre}"?`);

        if (confirmar) {
            try {
                // Referencia exacta al documento que queremos borrar
                const documentoRef = doc(db, "servicios", id);
                await deleteDoc(documentoRef);

                // Actualizamos el estado local filtrando el eliminado (para no recargar toda la base de datos)
                setServicios(servicios.filter(servicio => servicio.id !== id));
            } catch (error) {
                console.error("Error al intentar eliminar:", error);
                alert("Hubo un problema al intentar eliminar el registro.");
            }
        }
    };

    return (
        <div className={styles.contenedorGestion}>
            <div className={styles.cabecera}>
                <h2 className={styles.titulo}>Panel de Gestión de Servicios</h2>
                <p className={styles.subtitulo}>Administración del catálogo de la constructora</p>
                {/* Aquí montaremos el FormularioServicio en el próximo paso */}
                <button className={styles.botonCrear}>+ Nuevo Servicio</button>
            </div>

            {cargando ? (
                <div className={styles.estadoCarga}>Sincronizando con la base de datos...</div>
            ) : (
                <div className={styles.tablaContenedor}>
                    <table className={styles.tabla}>
                        <thead>
                            <tr>
                                <th>Rubro / Categoría</th>
                                <th>Nombre del Servicio</th>
                                <th>Alcance</th>
                                <th className={styles.columnaAcciones}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {servicios.map((servicio) => (
                                <tr key={servicio.id}>
                                    <td><span className={styles.badgeCategoria}>{servicio.categoria}</span></td>
                                    <td className={styles.celdaNombre}>{servicio.nombre}</td>
                                    <td>{servicio.alcance}</td>
                                    <td className={styles.celdaAcciones}>
                                        <button className={styles.botonEditar}>Editar</button>
                                        <button
                                            className={styles.botonEliminar}
                                            onClick={() => eliminarServicio(servicio.id, servicio.nombre)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {servicios.length === 0 && (
                                <tr>
                                    <td colSpan="4" className={styles.tablaVacia}>No hay servicios registrados en la base de datos.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
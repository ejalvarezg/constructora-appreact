// src/paginas/Gestion/Gestion.jsx
import React, { useState, useEffect, useContext, useRef } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Spinner } from '../../componentes/Spinner/Spinner';

import { FormularioServicio } from '../../componentes/FormularioServicio/FormularioServicio';

import styles from './Gestion.module.css';

export function Gestion() {
    // Referencia al formulario para volver a él al editar un servicio
    const formularioRef = useRef(null);

    const [servicios, setServicios] = useState([]);
    const [cargando, setCargando] = useState(true);

    // Estados para controlar la visibilidad del formulario y el servicio a editar
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [servicioAEditar, setServicioAEditar] = useState(null);

    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

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

    useEffect(() => {
        cargarServicios();
    }, []);

    // Función para borrar un registro de Firebase (Delete)
    const eliminarServicio = async (id, nombre) => {
        const confirmar = window.confirm(`¿Estás seguro de que deseas eliminar permanentemente el servicio: "${nombre}"?`);

        if (confirmar) {
            try {
                // Referencia al documento que se va a borrar
                const documentoRef = doc(db, "servicios", id);
                await deleteDoc(documentoRef);

                // Se filtra el eliminado
                setServicios(servicios.filter(servicio => servicio.id !== id));
            } catch (error) {
                console.error("Error al intentar eliminar:", error);
                alert("Hubo un problema al intentar eliminar el registro.");
            }
        }
    };

    // Lista de categorías existentes
    const categoriasExistentes = [...new Set(servicios.map(servicio => servicio.categoria))];

    // Funciones para botones del formulario

    // Función para cerrar sesión y redirigir a Inicio
    const handleLogout = async () => {
        try {
            await logout();
            navigate('/'); // Redirección inmediata a Inicio tras desconectar
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            alert("No se pudo cerrar la sesión correctamente.");
        }
    };

    // Nuevo servicio
    const handleNuevoServicio = () => {
        setServicioAEditar(null);
        setMostrarFormulario(true);
    };

    // Formulario con datos del servicio a editar
    const handleEditarServicio = (servicio) => {
        setServicioAEditar(servicio);
        setMostrarFormulario(true);

        // Desplazamiento suave hacia el formulario al editar un servicio
        setTimeout(() => {
            if (formularioRef.current) {
                formularioRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 0);
    };

    // Cierra el formulario sin guardar cambios
    const handleCerrarFormulario = () => {
        setMostrarFormulario(false);
        setServicioAEditar(null);
    };

    // Se ejecuta cuando el formulario termina de hacer addDoc o updateDoc exitosamente
    const handleGuardadoExitoso = () => {
        handleCerrarFormulario();
        cargarServicios(); // Refrescamos la tabla para ver los cambios impactados en Firebase
    };

    return (
        <div className={styles.contenedorGestion}>
            <div className={styles.cabecera}>
                <div className={styles.filaTitulo}>
                    <h2 className={styles.titulo}>Panel de Gestión de Servicios</h2>
                    <button className={styles.botonLogout} onClick={handleLogout}>
                        Cerrar Sesión
                    </button>
                </div>
                <p className={styles.subtitulo}>Administración del catálogo de la constructora</p>

                {/* Abre el formulario vacío (solo si no está abierto ya) */}
                {!mostrarFormulario && (
                    <button className={styles.botonCrear} onClick={handleNuevoServicio}>
                        + Nuevo Servicio
                    </button>
                )}
            </div>

            {/* Renderizado condicional del formulario */}
            {mostrarFormulario && (
                <div ref={formularioRef} style={{ scrollMarginTop: '100px' }}>
                    <FormularioServicio
                        servicioAEditar={servicioAEditar}
                        alCancelar={handleCerrarFormulario}
                        alGuardarConExito={handleGuardadoExitoso}
                        categoriasExistentes={categoriasExistentes}
                    />
                </div>
            )}

            {cargando ? (
                <Spinner mensaje="Sincronizando registros con los servidores de Firebase..." />
            ) : (
                <div className={styles.tablaContenedor}>
                    <table className={styles.tabla}>
                        <thead>
                            <tr>
                                <th>Categoría</th>
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

                                        {/* Botón Editar conectado al servicio */}
                                        <button
                                            className={styles.botonEditar}
                                            onClick={() => handleEditarServicio(servicio)}
                                        >
                                            Editar
                                        </button>

                                        {/* Botón Eliminar conectado a id y nombre */}
                                        <button
                                            className={styles.botonEliminar}
                                            onClick={() => eliminarServicio(servicio.id, servicio.nombre)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {/* Mensaje si la base de datos no tiene documentos */}
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
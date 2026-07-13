// src/paginas/ServicioDetalle/ServicioDetalle.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import styles from './ServicioDetalle.module.css';

// --- AGREGADO PARA FIREBASE -----------------------------
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
// --------------------------------------------------------

export function ServicioDetalle() {
    const { id } = useParams();
    const [servicio, setServicio] = useState(null);
    const [cargando, setCargando] = useState(true);

    const { agregarServicio, isInCart } = useContext(CartContext);

    useEffect(() => {
        // --- Firebase en lugar de fetch local ---
        const serviciosCollection = collection(db, "servicios");

        getDocs(serviciosCollection)
            .then((respuesta) => {
                // Obtener todos los documentos y les inyectamos el ID alfanumérico de Firebase
                const data = respuesta.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id
                }));

                // Buscamos el servicio comparando los IDs (ambos son strings ahora)
                const encontrado = data.find(item => item.id === id);
                setServicio(encontrado || null);
            })
            .catch(err => console.error("Error al buscar detalle en Firebase:", err))
            .finally(() => setCargando(false));
        // -----------------------------------------------

    }, [id]);

    if (cargando) return <div className={styles.mensajeEstado}>Cargando servicio...</div>;
    if (!servicio) {
        return (
            <div className={styles.mensajeEstadoError}>
                <h3>Este servicio no está disponible.</h3>
                <p>El servicio que ha solicitado no se encuentra en nuestro catálogo.</p>
                <Link to="/servicios" className={styles.botonVolver}>Volver al catálogo</Link>
            </div>
        );
    }

    const yaAgregado = isInCart(servicio.id);

    return (
        <article className={styles.bloqueDetalle}>
            {/* Panel izquierdo con imagen y metadatos */}
            <div className={styles.panelIzquierdo}>
                <img src={servicio.imagen} alt={servicio.nombre} className={styles.imagenFicha} />
                <div className={styles.metaEspecificaciones}>
                    <span className={styles.metaItem}><strong>Dirigido a:</strong> {servicio.alcance}</span>
                    <span className={styles.metaItem}><strong>Rubro:</strong> {servicio.categoria}</span>
                </div>
            </div>

            {/* Panel derecho con descripción y botón */}
            <div className={styles.panelDerecho}>
                <h2 className={styles.nombreServicio}>{servicio.nombre}</h2>
                <div className={styles.separador}></div>
                <h4 className={styles.seccionSubtitulo}>Descripción y alcance</h4>
                <p className={styles.descripcionLarga}>{servicio.descripcion_larga}</p>

                {/* Botón para agregar el servicio */}
                <button
                    className={styles.botonCotizar}
                    onClick={() => agregarServicio(servicio)}
                    disabled={yaAgregado}
                    // Deshabilitado si el servicio ya está agregado al carrito
                    style={yaAgregado ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                >
                    {yaAgregado ? 'Ya añadido al presupuesto ✓' : 'Añadir al presupuesto'}
                </button>
            </div>
        </article>
    );
}
// src/componentes/FormularioServicio/FormularioServicio.jsx
import React, { useState, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import styles from './FormularioServicio.module.css';

export function FormularioServicio({ servicioAEditar, alCancelar, alGuardarConExito, categoriasExistentes = [] }) {

    const estadoInicial = {
        nombre: '',
        categoria: '',
        descripcion_corta: '',
        descripcion_larga: '',
        imagen: '',
        alcance: 'Consorcios y Particulares'
    };

    const [formulario, setFormulario] = useState(estadoInicial);
    const [procesando, setProcesando] = useState(false);
    const [esNuevaCategoria, setEsNuevaCategoria] = useState(false);
    const [error, setError] = useState('');

    // Con un "servicioAEditar" se llena el formulario
    useEffect(() => {
        if (servicioAEditar) {
            setFormulario({
                nombre: servicioAEditar.nombre || '',
                categoria: servicioAEditar.categoria || '',
                descripcion_corta: servicioAEditar.descripcion_corta || '',
                descripcion_larga: servicioAEditar.descripcion_larga || '',
                imagen: servicioAEditar.imagen || '',
                alcance: servicioAEditar.alcance || ''
            });
        } else {
            setFormulario(estadoInicial);
        }
    }, [servicioAEditar]);

    // Manejo de cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormulario({ ...formulario, [name]: value });
    };

    // Validar y Enviar a Firebase
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Campos obligatorios
        if (!formulario.nombre || !formulario.descripcion_corta || !formulario.imagen) {
            setError('Por favor, completa los campos obligatorios (Nombre, Descripción corta e Imagen).');
            return;
        }

        setProcesando(true);

        try {
            if (servicioAEditar) {
                // UPDATE
                const docRef = doc(db, 'servicios', servicioAEditar.id);
                await updateDoc(docRef, formulario);
            } else {
                // CREATE
                const coleccionRef = collection(db, 'servicios');
                await addDoc(coleccionRef, formulario);
            }

            // Avisamos al componente padre (Gestion.jsx) que terminamos para que refresque la tabla
            alGuardarConExito();

        } catch (err) {
            console.error('Error al guardar en Firebase:', err);
            setError('Ocurrió un error al intentar guardar el servicio.');
        } finally {
            setProcesando(false);
        }
    };

    const handleCategoriaSelect = (e) => {
        const valor = e.target.value;
        if (valor === "NUEVA_CATEGORIA") {
            setEsNuevaCategoria(true);
            // Limpiamos el valor para que el input de texto arranque vacío
            setFormulario({ ...formulario, categoria: '' });
        } else {
            setEsNuevaCategoria(false);
            setFormulario({ ...formulario, categoria: valor });
        }
    };

    return (
        <form className={styles.formularioContenedor} onSubmit={handleSubmit}>
            <h3 className={styles.tituloFormulario}>
                {servicioAEditar ? 'Editar Servicio de Constructora' : 'Alta de Nuevo Servicio'}
            </h3>

            {error && <div className={styles.alertaError}>{error}</div>}

            <div className={styles.gridFormulario}>
                <div className={styles.grupoInput}>
                    <label>Nombre del servicio *</label>
                    <input
                        type="text"
                        name="nombre"
                        value={formulario.nombre}
                        onChange={handleChange}
                        placeholder="Ej: Pintura de Fachadas"
                    />
                </div>

                <div className={styles.grupoInput}>
                    <label>Categoría *</label>

                    {!esNuevaCategoria ? (
                        // OPCIÓN 1: Mostrar la lista desplegable
                        <select
                            name="categoria"
                            value={formulario.categoria}
                            onChange={handleCategoriaSelect}
                            required
                        >
                            <option value="" disabled>Seleccione una categoría...</option>
                            {categoriasExistentes.map((cat, index) => (
                                <option key={index} value={cat}>{cat}</option>
                            ))}
                            <option value="NUEVA_CATEGORIA" className={styles.opcionNueva}>
                                + Agregar nueva categoría...
                            </option>
                        </select>
                    ) : (
                        // OPCIÓN 2: Mostrar input de texto para crear una nueva
                        <div className={styles.contenedorNuevaCategoria}>
                            <input
                                type="text"
                                name="categoria"
                                value={formulario.categoria}
                                onChange={handleChange}
                                placeholder="Escriba la nueva categoría..."
                                required
                                autoFocus
                            />
                            <button
                                type="button"
                                className={styles.botonCancelarCategoria}
                                onClick={() => {
                                    setEsNuevaCategoria(false);
                                    setFormulario({ ...formulario, categoria: '' });
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    )}
                </div>

                <div className={styles.grupoInput}>
                    <label>Alcance (Mercado)</label>
                    <input
                        type="text"
                        name="alcance"
                        value={formulario.alcance}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.grupoInput}>
                    <label>URL de la Imagen *</label>
                    <input
                        type="url"
                        name="imagen"
                        value={formulario.imagen}
                        onChange={handleChange}
                        placeholder="https://..."
                    />
                </div>

                <div className={`${styles.grupoInput} ${styles.campoCompleto}`}>
                    <label>Descripción Corta (Resumen para la tarjeta) *</label>
                    <textarea
                        name="descripcion_corta"
                        value={formulario.descripcion_corta}
                        onChange={handleChange}
                        rows="2"
                    ></textarea>
                </div>

                <div className={`${styles.grupoInput} ${styles.campoCompleto}`}>
                    <label>Descripción Larga (Detalles del servicio)</label>
                    <textarea
                        name="descripcion_larga"
                        value={formulario.descripcion_larga}
                        onChange={handleChange}
                        rows="4"
                    ></textarea>
                </div>
            </div>

            <div className={styles.accionesFormulario}>
                <button type="button" className={styles.botonCancelar} onClick={alCancelar} disabled={procesando}>
                    Cancelar
                </button>
                <button type="submit" className={styles.botonGuardar} disabled={procesando}>
                    {procesando ? 'Guardando...' : (servicioAEditar ? 'Actualizar Servicio' : 'Crear Servicio')}
                </button>
            </div>
        </form>
    );
}
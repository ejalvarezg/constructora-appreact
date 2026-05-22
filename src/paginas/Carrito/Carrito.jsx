// src/paginas/Carrito/Carrito.jsx
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import styles from './Carrito.module.css';


export function Carrito() {
    const [formularioCliente, setFormularioCliente] = useState({
        nombre: '', consorcio: '', email: '', telefono: '', observacionesGenerales: ''
    });

    // Funciones y datos del carrito desde el contexto
    const { serviciosSeleccionados, eliminarServicio, vaciarCarrito } = useContext(CartContext);

    const [detallesTecnicos, setDetallesTecnicos] = useState({});

    // Maneja campos del formulario del cliente
    const handleClienteChange = (e) => {
        const { name, value } = e.target;
        setFormularioCliente({ ...formularioCliente, [name]: value });
    };

    // Maneja campos específicos de cada servicio seleccionado
    const handleDetalleTecnicoChange = (servicioId, campoName, valor) => {
        setDetallesTecnicos({
            ...detallesTecnicos,
            [servicioId]: {
                ...detallesTecnicos[servicioId],
                [campoName]: valor
            }
        });
    };

    // Procesamiento y envío consolidado del pedido
    const handleSubmit = (e) => {
        e.preventDefault();
        const pedidoFinal = {
            solicitante: formularioCliente,
            modulosRequeridos: serviciosSeleccionados.map(s => ({
                id: s.id, nombre: s.nombre, especificacionesEspecificas: detallesTecnicos[s.id] || {}
            })),
            fechaRegistro: new Date().toLocaleDateString()
        };
        console.log("Pedido Final:", pedidoFinal);
        alert("Solicitud de presupuesto enviada con éxito.");
        vaciarCarrito();
    };

    return (
        <div className={styles.contenedor}>
            <div className={styles.encabezado}>
                <h2 className={styles.titulo}>Pedido de Presupuesto</h2>
                <p className={styles.bajada}>
                    Consolide toda la información de su solicitud con la mayor precisión posible
                    para que nuestro equipo pueda brindarle un presupuesto detallado y ajustado a sus necesidades.
                    Tenga presente que cada servicio puede requerir información técnica específica
                    que se obtiene solamente tras el relevamiento de nuestros técnicos.
                    <br /><br />
                    La información que usted brinde en este formulario nos ayudará a entender mejor su situación
                    y a prepararnos para la inspección, pero no es vinculante ni limitativa para el alcance de la misma.
                    Nuestro equipo se comunicará con usted para coordinar la visita.
                </p>
            </div>

            <div className={styles.layoutPanel}>
                {/* Panel Izquierdo: Formulario de datos del cliente */}
                <form onSubmit={handleSubmit} className={styles.formulario}>
                    <h3 className={styles.subtituloSeccion}>Datos del cliente</h3>

                    <div className={styles.grupoInput}>
                        <label htmlFor="nombre">Nombre y Apellido / Razón Social *</label>
                        <input
                            type="text" id="nombre" name="nombre" required
                            value={formularioCliente.nombre} onChange={handleClienteChange}
                            placeholder="Ej: Administración Rossi"
                        />
                    </div>

                    <div className={styles.grupoInput}>
                        <label htmlFor="consorcio">Dirección *</label>
                        <input
                            type="text" id="consorcio" name="consorcio" required
                            value={formularioCliente.consorcio} onChange={handleClienteChange}
                            placeholder="Ej: Edificio Soler 4059"
                        />
                    </div>

                    <div className={styles.filaInputs}>
                        <div className={styles.grupoInput}>
                            <label htmlFor="email">Correo electrónico *</label>
                            <input
                                type="email" id="email" name="email" required
                                value={formularioCliente.email} onChange={handleClienteChange}
                                placeholder="usuario@correo.com"
                            />
                        </div>
                        <div className={styles.grupoInput}>
                            <label htmlFor="telefono">Teléfono *</label>
                            <input
                                type="tel" id="telefono" name="telefono" required
                                value={formularioCliente.telefono} onChange={handleClienteChange}
                                placeholder="Ej: 11-4567-8901"
                            />
                        </div>
                    </div>

                    <div className={styles.grupoInput}>
                        <label htmlFor="observacionesGenerales">Notas Adicionales para el Inspector</label>
                        <textarea
                            id="observacionesGenerales" name="observacionesGenerales" rows="4"
                            value={formularioCliente.observacionesGenerales} onChange={handleClienteChange}
                            placeholder="Reparaciones previas, problemas recurrentes, horarios de visita preferidos, etc."
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className={styles.botonEnviar}
                        disabled={serviciosSeleccionados.length === 0}
                    >
                        Enviar Solicitud de Presupuesto
                    </button>
                </form>

                {/* Panel Derecho: Especificaciones dinámicas por Rubro */}
                <div className={styles.resumenServicios}>
                    <h3 className={styles.subtituloSeccion}>Información básica de servicios solicitados</h3>

                    {serviciosSeleccionados.length === 0 ? (
                        <div className={styles.listaVacia}>
                            <p className={styles.textoVacio}>No ha seleccionado ningún servicio.</p>
                            <Link to="/servicios" className={styles.botonAgregarRubros}>
                                + Agregar rubros
                            </Link>
                        </div>
                    ) : (
                        <div className={styles.lista}>
                            <Link to="/servicios" className={styles.botonAgregarRubros}>
                                + Agregar rubros
                            </Link>
                            {serviciosSeleccionados.map((servicio) => (
                                <div key={servicio.id} className={styles.cardServicioDinamico}>
                                    <div className={styles.encabezadoCard}>
                                        <div>
                                            <span className={styles.tagCategoria}>{servicio.categoria}</span>
                                            <h4 className={styles.nombreRubro}>{servicio.nombre}</h4>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => eliminarServicio(servicio.id)}
                                            className={styles.botonEliminar}
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    {servicio.campos_especificos && (
                                        <div className={styles.bloqueCamposVariables}>
                                            {servicio.campos_especificos.map((campo) => (
                                                <div key={campo.name} className={styles.grupoInputInterno}>
                                                    <label>{campo.label}</label>

                                                    {campo.type === 'select' ? (
                                                        <select
                                                            required
                                                            value={detallesTecnicos[servicio.id]?.[campo.name] || ''}
                                                            onChange={(e) => handleDetalleTecnicoChange(servicio.id, campo.name, e.target.value)}
                                                        >
                                                            <option value="" disabled>-- Seleccione una opción --</option>
                                                            {campo.opciones.map(opt => (
                                                                <option key={opt} value={opt}>{opt}</option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <input
                                                            type={campo.type}
                                                            placeholder={campo.placeholder}
                                                            required
                                                            value={detallesTecnicos[servicio.id]?.[campo.name] || ''}
                                                            onChange={(e) => handleDetalleTecnicoChange(servicio.id, campo.name, e.target.value)}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Campo de notas particulares por servicio */}
                                    <div className={styles.grupoInputInterno}>
                                        <label>Describa el problema</label>
                                        <textarea
                                            rows="2"
                                            placeholder="Ej: El ascensor se detiene entre pisos, hace ruidos extraños, etc."
                                            value={detallesTecnicos[servicio.id]?.observaciones_rubro || ''}
                                            onChange={(e) => handleDetalleTecnicoChange(servicio.id, 'observaciones_rubro', e.target.value)}
                                        ></textarea>
                                    </div>
                                </div>
                            ))}

                            <div className={styles.totalizador}>
                                <span>Servicios solicitados:</span>
                                <strong>{serviciosSeleccionados.length} Item(s)</strong>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
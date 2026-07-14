// src/paginas/Carrito/Carrito.jsx
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { collection, query, where, getDocs, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import styles from './Carrito.module.css';


export function Carrito() {
    const [formularioCliente, setFormularioCliente] = useState({
        nombre: '', consorcio: '', email: '', telefono: '', observacionesGenerales: ''
    });

    // Funciones y datos del carrito desde el contexto
    const { serviciosSeleccionados, eliminarServicio, vaciarCarrito } = useContext(CartContext);

    const [detallesTecnicos, setDetallesTecnicos] = useState({});

    // Estados para manejo de cupones
    const [codigoCupon, setCodigoCupon] = useState("");
    const [cuponAplicado, setCuponAplicado] = useState(null);
    const [mensajeCupon, setMensajeCupon] = useState({ texto: "", tipo: "" }); // tipo: 'exito' | 'error'
    const [validandoCupon, setValidandoCupon] = useState(false);

    // Estado para manejar la confirmación de pedido exitoso
    const [pedidoExitoso, setPedidoExitoso] = useState(false);

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

    // Procesamiento y envío del pedido a Firestore
    const handleSubmit = async (e) => {
        e.preventDefault();

        const pedidoFinal = {
            solicitante: formularioCliente,
            serviciosRequeridos: serviciosSeleccionados.map(s => ({
                id: s.id,
                nombre: s.nombre,
                categoria: s.categoria,
                especificaciones: detallesTecnicos[s.id] || {}
            })),
            fechaRegistro: new Date().toISOString(),
            estado: "Pendiente"
        };

        // Si se usó un cupón, queda registrado en el documento
        if (cuponAplicado) {
            pedidoFinal.descuentoAplicado = {
                codigo: cuponAplicado.codigo,
                monto: cuponAplicado.monto
            };
        }

        try {
            // Agregar el registro en la colección "solicitudes"
            await addDoc(collection(db, "solicitudes"), pedidoFinal);

            // Actualizar el contador del cupón
            if (cuponAplicado) {
                const nuevosUsos = cuponAplicado.usosActuales + 1;
                const seAgoto = nuevosUsos >= cuponAplicado.limiteUsos;
                const cuponRef = doc(db, "cupones", cuponAplicado.id);
                await updateDoc(cuponRef, {
                    usosActuales: nuevosUsos,
                    activo: !seAgoto // Si se agotó, no puede usarse más
                });
            }

            setPedidoExitoso(true);

            vaciarCarrito();
            setFormularioCliente({ nombre: '', consorcio: '', email: '', telefono: '', observacionesGenerales: '' });
            setDetallesTecnicos({});
            setCuponAplicado(null);
            setCodigoCupon("");

        } catch (error) {
            console.error("Error al procesar la solicitud:", error);
            setPedidoExitoso(false);
            alert("Hubo un problema al enviar su pedido. Por favor, intente nuevamente.");
        }
    };

    // Confirmación antes de vaciar el carrito
    const handleVaciar = () => {
        if (confirm('¿Vaciar el carrito?')) vaciarCarrito();
    };

    const handleAplicarCupon = async (e) => {
        e.preventDefault();
        if (!codigoCupon.trim()) return;

        setValidandoCupon(true);
        setMensajeCupon({ texto: "", tipo: "" });

        try {
            // 1. Buscar el cupón en Firestore
            const q = query(
                collection(db, "cupones"),
                where("codigo", "==", codigoCupon.trim().toUpperCase())
            );
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setMensajeCupon({ texto: "El código ingresado no es válido o no existe.", tipo: "error" });
                setValidandoCupon(false);
                return;
            }

            const cuponDoc = querySnapshot.docs[0];
            const cuponData = cuponDoc.data();

            // 2. Validar si el cupón está activo
            if (!cuponData.activo) {
                setMensajeCupon({ texto: "Este beneficio ya no se encuentra disponible.", tipo: "error" });
                return;
            }

            // 3. Comprobar límite de usos
            if (cuponData.usosActuales >= cuponData.limiteUsos) {
                setMensajeCupon({ texto: "El cupón ha alcanzado su límite máximo de usos.", tipo: "error" });
                return;
            }

            // 4. Verificar fecha de vencimiento
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            const [anio, mes, dia] = cuponData.fechaVencimiento.split('-');
            const fechaVenc = new Date(anio, mes - 1, dia);

            if (hoy > fechaVenc) {
                setMensajeCupon({ texto: "Este cupón ha caducado.", tipo: "error" });
                return;
            }

            // 5. Si todo es válido, aplicar el cupón
            setCuponAplicado({ id: cuponDoc.id, ...cuponData });
            setMensajeCupon({
                texto: `¡Beneficio validado! Se descontarán $${cuponData.monto.toLocaleString('es-AR')} del presupuesto final.`,
                tipo: "exito"
            });
            setCodigoCupon(""); // Limpiar el input

        } catch (error) {
            console.error("Error al validar:", error);
            setMensajeCupon({ texto: "Error de conexión al validar el cupón.", tipo: "error" });
        } finally {
            setValidandoCupon(false);
        }
    };

    const removerCupon = () => {
        setCuponAplicado(null);
        setMensajeCupon({ texto: "", tipo: "" });
    };

    if (pedidoExitoso) {
        return (
            <div className={styles.contenedorExito}>
                <div className={styles.tarjetaExito}>
                    <span className={styles.iconoGranExito}>✅</span>
                    <h2 className={styles.tituloExito}>¡Solicitud enviada con éxito!</h2>
                    <p className={styles.mensajeExitoFinal}>
                        Hemos recibido su pedido de presupuesto detallado. Nuestro equipo técnico analizará la información y se pondrá en contacto a la brevedad para coordinar la visita de inspección.
                    </p>
                    <Link to="/" className={styles.botonVolverInicio}>
                        Volver al Inicio
                    </Link>
                </div>
            </div>
        );
    }

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

                    {/* Nombre y apellido del cliente */}
                    <div className={styles.grupoInput}>
                        <label htmlFor="nombre">Nombre y Apellido / Razón Social *</label>
                        <input
                            type="text" id="nombre" name="nombre" required
                            value={formularioCliente.nombre} onChange={handleClienteChange}
                            placeholder="Ej: Administración Rossi"
                        />
                    </div>

                    {/* Dirección del cliente */}
                    <div className={styles.grupoInput}>
                        <label htmlFor="consorcio">Dirección *</label>
                        <input
                            type="text" id="consorcio" name="consorcio" required
                            value={formularioCliente.consorcio} onChange={handleClienteChange}
                            placeholder="Ej: Edificio Soler 4059"
                        />
                    </div>

                    {/* Correo electrónico y teléfono del cliente */}
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

                    {/* Cupón */}
                    <div className={styles.contenedorCupon}>
                        <h4 className={styles.tituloCupon}>¿Tienes un código de descuento?</h4>
                        {!cuponAplicado ? (
                            <div className={styles.formularioCupon}>
                                <input
                                    type="text"
                                    placeholder="Ej: MICUPON"
                                    value={codigoCupon}
                                    onChange={(e) => setCodigoCupon(e.target.value)}
                                    disabled={validandoCupon}
                                />
                                <button type="button" onClick={handleAplicarCupon} disabled={validandoCupon || !codigoCupon.trim()}>
                                    {validandoCupon ? "Validando..." : "Aplicar"}
                                </button>
                            </div>
                        ) : (
                            <div className={styles.cuponActivo}>
                                <span className={styles.iconoExito}>✔️</span>
                                <div>
                                    <strong>{cuponAplicado.codigo}</strong> aplicado.
                                    <p className={styles.detalleMonto}>
                                        Bonificación de ${cuponAplicado.monto.toLocaleString('es-AR')} reservada.
                                    </p>
                                </div>
                                <button type="button" onClick={removerCupon} className={styles.botonRemover}>✕</button>
                            </div>
                        )}

                        {/* Mensajes de error o éxito */}
                        {mensajeCupon.texto && !cuponAplicado && (
                            <p className={mensajeCupon.tipo === 'error' ? styles.mensajeError : styles.mensajeExito}>
                                {mensajeCupon.texto}
                            </p>
                        )}
                    </div>

                    {/* Notas adicionales del cliente */}
                    <div className={styles.grupoInput}>
                        <label htmlFor="observacionesGenerales">Notas Adicionales para el técnico</label>
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
                                + Agregar servicios
                            </Link>
                        </div>
                    ) : (
                        <div className={styles.lista}>
                            {/* Agregar servicios + Vaciar carrito */}
                            <div className={styles.bloqueAcciones}>
                                <Link to="/servicios" className={styles.botonAgregarRubros}>
                                    + Agregar rubros
                                </Link>
                                <button
                                    type="button"
                                    className={styles.botonVaciar}
                                    onClick={vaciarCarrito}
                                >
                                    Vaciar presupuesto
                                </button>
                            </div>
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
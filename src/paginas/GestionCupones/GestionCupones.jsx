// src/paginas/GestionCupones/GestionCupones.jsx
import React, { useState, useEffect, useRef } from "react";
import { db } from "../../firebase/config";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Spinner } from "../../componentes/Spinner/Spinner";
import styles from "./GestionCupones.module.css";

const estadoInicial = {
    codigo: "",
    monto: "50000",
    limiteUsos: "",
    fechaVencimiento: "",
    activo: true
};

export function GestionCupones() {
    const [datosForm, setDatosForm] = useState(estadoInicial);
    const [cupones, setCupones] = useState([]);
    const [cuponAEditar, setCuponAEditar] = useState(null);
    const [cargando, setCargando] = useState(true);
    const formularioRef = useRef(null);

    const obtenerCupones = async () => {
        setCargando(true);
        try {
            const respuesta = await getDocs(collection(db, "cupones"));
            const lista = respuesta.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setCupones(lista);
        } catch (error) {
            console.error("Error al obtener cupones:", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerCupones();
    }, []);

    const manejarCambio = (e) => {
        const { name, value, type, checked } = e.target;
        setDatosForm({
            ...datosForm,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();

        if (!datosForm.codigo || !datosForm.monto || !datosForm.limiteUsos || !datosForm.fechaVencimiento) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        const datosAGuardar = {
            codigo: datosForm.codigo.toUpperCase(),
            monto: Number(datosForm.monto),
            limiteUsos: Number(datosForm.limiteUsos),
            fechaVencimiento: datosForm.fechaVencimiento,
            activo: datosForm.activo,
            usosActuales: cuponAEditar ? cuponAEditar.usosActuales : 0
        };

        try {
            if (cuponAEditar) {
                await updateDoc(doc(db, "cupones", cuponAEditar.id), datosAGuardar);
            } else {
                await addDoc(collection(db, "cupones"), datosAGuardar);
            }

            setDatosForm(estadoInicial);
            setCuponAEditar(null);
            obtenerCupones();
        } catch (error) {
            console.error("Error al guardar cupón:", error);
            alert("Ocurrió un error al intentar guardar el cupón.");
        }
    };

    const editarCupon = (cupon) => {
        setCuponAEditar(cupon);
        setDatosForm({
            codigo: cupon.codigo,
            monto: cupon.monto.toString(),
            limiteUsos: cupon.limiteUsos.toString(),
            fechaVencimiento: cupon.fechaVencimiento,
            activo: cupon.activo
        });

        setTimeout(() => {
            if (formularioRef.current) {
                formularioRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 0);
    };

    const eliminarCupon = async (id, codigo) => {
        const confirmar = window.confirm(`¿Estás seguro de eliminar el cupón "${codigo}"?`);
        if (confirmar) {
            try {
                await deleteDoc(doc(db, "cupones", id));
                if (cuponAEditar?.id === id) {
                    setCuponAEditar(null);
                    setDatosForm(estadoInicial);
                }
                obtenerCupones();
            } catch (error) {
                console.error("Error al eliminar:", error);
            }
        }
    };

    const cancelarEdicion = () => {
        setCuponAEditar(null);
        setDatosForm(estadoInicial);
    };

    return (
        <div className={styles.contenedor}>
            <div className={styles.cabecera}>
                <h2 className={styles.titulo}>Gestión de Beneficios</h2>
                <p>Crea cupones de descuento fijo para ofrecer a tus clientes.</p>
            </div>

            <form ref={formularioRef} className={styles.formulario} style={{ scrollMarginTop: '120px' }} onSubmit={manejarEnvio}>
                <div className={styles.grupoInput}>
                    <label>Código del Cupón</label>
                    <input type="text" name="codigo" value={datosForm.codigo} onChange={manejarCambio} placeholder="Ej: INVIERNO26" required />
                </div>

                <div className={styles.grupoInput}>
                    <label>Monto a Descontar ($)</label>
                    <select name="monto" value={datosForm.monto} onChange={manejarCambio} required>
                        <option value="50000">$ 50.000</option>
                        <option value="100000">$ 100.000</option>
                        <option value="250000">$ 250.000</option>
                    </select>
                </div>

                <div className={styles.grupoInput}>
                    <label>Límite de Usos</label>
                    <input type="number" name="limiteUsos" value={datosForm.limiteUsos} onChange={manejarCambio} placeholder="Ej: 50" min="1" required />
                </div>

                <div className={styles.grupoInput}>
                    <label>Fecha de Vencimiento</label>
                    <input type="date" name="fechaVencimiento" value={datosForm.fechaVencimiento} onChange={manejarCambio} required />
                </div>

                <div className={`${styles.grupoInput} ${styles.checkboxContainer}`}>
                    <input type="checkbox" name="activo" id="activo" checked={datosForm.activo} onChange={manejarCambio} />
                    <label htmlFor="activo">Habilitado para su uso</label>
                </div>

                <div className={styles.accionesFormulario}>
                    <button type="submit" className={styles.botonGuardar}>
                        {cuponAEditar ? "Actualizar Cupón" : "Crear Cupón"}
                    </button>
                    {cuponAEditar && (
                        <button type="button" className={styles.botonCancelar} onClick={cancelarEdicion}>
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            {cargando ? (
                <Spinner mensaje="Cargando cupones registrados..." />
            ) : (
                <div className={styles.tablaContenedor}>
                    <table className={styles.tabla}>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Descuento</th>
                                <th>Usos</th>
                                <th>Vencimiento</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cupones.map((cupon) => (
                                <tr key={cupon.id}>
                                    <td><strong>{cupon.codigo}</strong></td>
                                    <td>$ {cupon.monto.toLocaleString('es-AR')}</td>
                                    <td>{cupon.usosActuales} / {cupon.limiteUsos}</td>
                                    <td>{new Date(cupon.fechaVencimiento).toLocaleDateString('es-AR')}</td>
                                    <td>
                                        <span className={cupon.activo ? styles.badgeActivo : styles.badgeInactivo}>
                                            {cupon.activo ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>
                                    <td>
                                        <button className={styles.botonEditar} onClick={() => editarCupon(cupon)}>Editar</button>
                                        <button className={styles.botonEliminar} onClick={() => eliminarCupon(cupon.id, cupon.codigo)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                            {cupones.length === 0 && (
                                <tr>
                                    <td colSpan="6" className={styles.tablaVacia}>No hay cupones registrados.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
// src/componentes/Footer/Footer.jsx
import React, { useState, useEffect } from 'react';
import { TarjetasMiembros } from '../TarjetasMiembros/TarjetasMiembros';
import styles from './Footer.module.css';

export function Footer() {
    const [personal, setPersonal] = useState([]);

    // Carga de información del personal desde el archivo JSON al montar el componente
    useEffect(() => {
        fetch('/data/personal.json')
            .then(respuesta => {
                if (!respuesta.ok) {
                    throw new Error('No se pudo acceder a la información del personal.');
                }
                return respuesta.json();
            })
            .then(data => setPersonal(data))
            .catch(error => console.error("Error al mostrar información del personal:", error));
    }, []);
    

    return (
        <footer className={styles.footerGlobal}>
            <div className={styles.limiteAncho}>

                {/* Información de la empresa */}
                <div className={styles.seccionEmpresa}>
                    <h3 className={styles.empresa}>Constructora Bricks S.A.</h3>
                    <p className={styles.datosLegales}>
                        Licitaciones Públicas y Privadas • Proveedor de Consorcios.<br />
                        Sede Central: Av. Corrientes 3000, Ciudad Autónoma de Buenos Aires, Argentina.<br />
                        Contacto Técnico: soporte@constructorabricks.com.ar
                    </p>
                </div>

                {/* TarjetasMiembros con información del personal */}
                <div className={styles.seccionEquipo}>
                    <h4 className={styles.tituloEquipo}>Equipo Técnico</h4>
                    <div className={styles.grillaEquipo}>
                        {personal.map((miembro) => (
                            <TarjetasMiembros
                                key={miembro.id}
                                nombre={miembro.nombre}
                                puesto={miembro.puesto}
                                matricula={miembro.matricula}
                                imagen={miembro.imagen}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </footer>
    );
}
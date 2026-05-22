// src/paginas/Inicio/Inicio.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import styles from './Inicio.module.css';

export function Inicio() {
    // Consumo del estado global para determinar el destino dinámico
    const { serviciosSeleccionados } = useContext(CartContext);
    
    // Si no hay servicios, el botón de presupuesto redirige a la grilla de selección
    const rutaPresupuesto = serviciosSeleccionados.length === 0 ? "/servicios" : "/carrito";

    return (
        <div className={styles.contenedorHome}>
            
            {/* 1. BLOQUE HÉROE (Hero Section) */}
            <section className={styles.heroe}>
                <div className={styles.capaFiltro}></div>
                <div className={styles.contenidoHeroe}>
                    <h1 className={styles.tituloPrincipal}>
                        Soluciones Integrales en Reparaciones y Mantenimiento Edilicio
                    </h1>
                    <p className={styles.bajadaHeroe}>
                        Especialistas en la preservación, refacción y adecuación normativa de consorcios, 
                        oficinas corporativas y propiedades particulares.
                    </p>
                    <div className={styles.bloqueBotones}>
                        <Link to="/servicios" className={styles.botonCtaSecundario}>
                            Ver Rubros Disponibles
                        </Link>
                        
                        {/* El destino muta de forma transparente según el estado del contexto */}
                        <Link to={rutaPresupuesto} className={styles.botonCtaPrincipal}>
                            Solicitar Presupuesto Técnico
                        </Link>
                    </div>
                </div>
            </section>

            {/* 2. BARRA DE VALIDACIÓN RÁPIDA (Trust Bar) */}
            <section className={styles.barraValidacion}>
                <div className={styles.itemValidacion}>
                    <span className={styles.iconoValidacion}>🛡️</span>
                    <div>
                        <h4 className={styles.tituloValidacion}>Personal Asegurado</h4>
                        <p className={styles.textoValidacion}>Cuadrillas homologadas con cobertura estricta de ART.</p>
                    </div>
                </div>
                <div className={styles.itemValidacion}>
                    <span className={styles.iconoValidacion}>🛠️</span>
                    <div>
                        <h4 className={styles.tituloValidacion}>Multi-Rubro Especializado</h4>
                        <p className={styles.textoValidacion}>Desde filtraciones críticas hasta acabados de pintura.</p>
                    </div>
                </div>
                <div className={styles.itemValidacion}>
                    <span className={styles.iconoValidacion}>📝</span>
                    <div>
                        <h4 className={styles.tituloValidacion}>Transparencia Legal</h4>
                        <p className={styles.textoValidacion}>Presupuestos detallados aptos para rendición de expensas.</p>
                    </div>
                </div>
            </section>

            {/* 3. BLOQUE INFORMATIVO DE PROCESO (How It Works) */}
            <section className={styles.seccionProceso}>
                <h2 className={styles.tituloSeccion}>¿Cómo Gestionar su Solicitud?</h2>
                <div className={styles.lineaProceso}>
                    
                    <div className={styles.paso}>
                        <div className={styles.numeroPaso}>1</div>
                        <h3 className={styles.tituloPaso}>Preselección de Rubros</h3>
                        <p className={styles.textoPaso}>
                            Explore nuestro catálogo de servicios, elija las especialidades que su inmueble 
                            requiere e ingrese los detalles específicos de la avería.
                        </p>
                    </div>

                    <div className={styles.paso}>
                        <div className={styles.numeroPaso}>2</div>
                        <h3 className={styles.tituloPaso}>Auditoría Preliminar</h3>
                        <p className={styles.textoPaso}>
                            Nuestra oficina técnica evalúa la memoria descriptiva cargada para analizar 
                            la complejidad estructural y los materiales requeridos.
                        </p>
                    </div>

                    <div className={styles.paso}>
                        <div className={styles.numeroPaso}>3</div>
                        <h3 className={styles.tituloPaso}>Inspección y Cierre</h3>
                        <p className={styles.textoPaso}>
                            Coordinamos una visita física obligatoria en el emplazamiento para emitir 
                            el pliego final de cotización cerrado sin sorpresas.
                        </p>
                    </div>

                </div>
            </section>

            {/* 4. SECCIÓN DE RESPALDO CORPORATIVO (Garantías) */}
            <section className={styles.seccionRespaldo}>
                <div className={styles.tarjetaRespaldo}>
                    <h2 className={styles.tituloRespaldo}>Respaldo Corporativo para Administraciones</h2>
                    <p className={styles.textoRespaldo}>
                        Entendemos las exigencias de la gestión de consorcios. Todas nuestras intervenciones 
                        en **impermeabilizaciones, plomería, gas, electricidad, pintura, herrería y carpintería** cumplen estrictamente con las normativas municipales vigentes. 
                        Proveemos la documentación legal complementaria, seguros de responsabilidad civil para trabajos 
                        en altura (silletistas) y facturación formal requerida por el consejo de propietarios.
                    </p>
                </div>
            </section>

            {/* 5. LLAMADO A LA ACCIÓN FINAL (Footer CTA) */}
            <section className={styles.ctaFinal}>
                <h2 className={styles.tituloCtaFinal}>¿Tiene un siniestro o reparación pendiente en su edificio?</h2>
                <p className={styles.bajadaCtaFinal}>
                    Evite penalizaciones o daños mayores. Consolide su requerimiento técnico ahora mismo.
                </p>
                
                {/* Aplicamos el mismo comportamiento adaptativo al botón de cierre inferior */}
                <Link to={rutaPresupuesto} className={styles.botonCtaGrande}>
                    Iniciar Pedido de Cotización
                </Link>
            </section>

        </div>
    );
}
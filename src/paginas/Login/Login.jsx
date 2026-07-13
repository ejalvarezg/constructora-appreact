// src/paginas/Login/Login.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

import styles from './Login.module.css';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cargando, setCargando] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setCargando(true);
        try {
            await login(email, password);
            navigate('/gestion');
        } catch (error) {
            alert('Credenciales inválidas. Por favor verifique el correo y contraseña.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className={styles.contenedorLogin}>
            <div className={styles.tarjetaLogin}>
                <h2 className={styles.titulo}>Acceso Interno</h2>
                <p className={styles.subtitulo}>Portal de Gestión Bricks S.A.</p>

                <form className={styles.formulario} onSubmit={handleLogin}>
                    <div className={styles.grupoInput}>
                        <label>Correo Electrónico</label>
                        <input
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="nombre@constructorabricks.com"
                            required
                        />
                    </div>

                    <div className={styles.grupoInput}>
                        <label>Contraseña</label>
                        <input
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.botonIngresar}
                        disabled={cargando}
                    >
                        {cargando ? 'Verificando...' : 'Ingresar'}
                    </button>
                </form>
            </div>
        </div>
    );
}
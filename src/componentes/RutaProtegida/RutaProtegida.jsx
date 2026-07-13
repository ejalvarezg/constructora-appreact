// src/componentes/RutaProtegida.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export function RutaProtegida({ children }) {
    const { usuario, cargando } = useContext(AuthContext);

    if (cargando) return <div>Verificando credenciales...</div>;

    return usuario ? children : <Navigate to="/login" />;
}
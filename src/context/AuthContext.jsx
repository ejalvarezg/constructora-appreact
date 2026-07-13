// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);
    const auth = getAuth();

    useEffect(() => {
        // Escucha cambios en el estado de autenticación de Firebase
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUsuario(user);
            setCargando(false);
        });
        return unsubscribe;
    }, [auth]);

    const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
    const logout = () => signOut(auth);

    return (
        <AuthContext.Provider value={{ usuario, login, logout, cargando }}>
            {children}
        </AuthContext.Provider>
    );
}
// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { Layout } from './componentes/Layout/Layout';
import { Inicio } from './paginas/Inicio/Inicio';
import { Servicios } from './paginas/Servicios/Servicios';
import { ServicioDetalle } from './paginas/ServicioDetalle/ServicioDetalle';
import { Carrito } from './paginas/Carrito/Carrito';
import { Gestion } from './paginas/Gestion/Gestion';

import { Login } from './paginas/Login/Login';
import { RutaProtegida } from './componentes/RutaProtegida/RutaProtegida';

import './App.css';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Rutas Públicas */}
        <Route path="/" element={<Inicio />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/servicio/:id" element={<ServicioDetalle />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas Protegidas */}
        <Route path="/gestion"
          element={
            <RutaProtegida>
              <Gestion />
            </RutaProtegida>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
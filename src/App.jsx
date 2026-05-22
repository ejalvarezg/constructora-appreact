// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { Layout } from './componentes/Layout/Layout';
import { Inicio } from './paginas/Inicio/Inicio';
import { Servicios } from './paginas/Servicios/Servicios'; 
import { ServicioDetalle } from './paginas/ServicioDetalle/ServicioDetalle'; 
import { Carrito } from './paginas/Carrito/Carrito'; 

import './App.css';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Inicio />} />
        
        {/* Rubros y Servicios */}
        <Route path="/servicios" element={<Servicios />} />
        
        {/* Detalle de servicio */}
        <Route path="/servicio/:id" element={<ServicioDetalle />} />
        
        {/* Presupuesto */}
        <Route path="/carrito" element={<Carrito />} />
        
      </Route>
    </Routes>
  );
}

export default App;
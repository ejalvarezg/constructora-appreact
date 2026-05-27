# Instrucciones de Copilot para constructora-app

## Comandos de build, test y lint
- Instalar dependencias: `npm install`
- Iniciar servidor de desarrollo (hot reload): `npm run dev`  # ejecuta Vite
- Generar build de producción: `npm run build`
- Previsualizar build de producción localmente: `npm run preview`
- Lint: `npm run lint`  # ejecuta `eslint .`

Notas sobre tests: No hay un runner de tests ni scripts de prueba configurados en package.json. Si se agregan tests, añadir un script `test` (o `test:unit`) y documentar cómo ejecutar una prueba individual, por ejemplo:
- Con Vitest (si se instala): `npx vitest run ruta/al/archivo -- -t "nombre del test"`
- Con Jest (si se instala): `npx jest ruta/al/archivo -t "nombre del test"`

## Arquitectura de alto nivel
- Herramientas: Vite + React (ver `vite.config.js`, `package.json`).
- Punto de entrada: `src/main.jsx` — envuelve la app con `BrowserRouter` y `CartProvider`.
- Rutas: `src/App.jsx` declara las rutas principales dentro de un `<Layout />` compartido:
  - `/` -> `Inicio`
  - `/servicios` -> `Servicios`
  - `/servicio/:id` -> `ServicioDetalle`
  - `/carrito` -> `Carrito`
- Estado: El estado global del presupuesto/carrito se gestiona en `src/context/CartContext.jsx` (React Context) para evitar prop-drilling. El proveedor `CartProvider` expone `serviciosSeleccionados`, `agregarServicio`, `eliminarServicio`, `vaciarCarrito`.
- Componentes: `src/componentes/` contiene piezas reutilizables (Header, Navbar, Layout, ServicioCard, TarjetasMiembros).
- Páginas: `src/paginas/` organiza componentes a nivel de página en español (Inicio, Servicios, ServicioDetalle, Carrito).
- Datos estáticos: `public/data/servicios.json` y `public/data/personal.json` son la fuente de datos simulada (se cargan desde el cliente).
- Estilos: Se usan CSS Modules por componente (`*.module.css`) junto con estilos globales en `App.css` / `index.css`.

## Convenciones clave (específicas del proyecto)
- Identificadores en español: nombres de carpetas y variables usan español (`componentes`, `paginas`, `serviciosSeleccionados`, etc.). Esperar funciones y variables en español en todo el código.
- Patrón centrado en Context para el carrito: preferir `CartContext` en lugar de pasar props para selección y conteo de servicios.
- Sin backend: la app lee JSON desde `public/data/` y simula comportamiento de servidor en cliente — busque lecturas de archivos estáticos en lugar de llamadas a APIs remotas.
- Evitar duplicados al añadir servicios: `agregarServicio` comprueba `id` antes de añadir. Mantener este patrón al mutar el carrito.
- Exports: los componentes suelen exportarse como named exports; revisar el estilo de importación usado en `src/App.jsx` (ej. `import { Layout } from './componentes/Layout/Layout'`).
- Rutas y slugs: los parámetros de ruta usan nombres singulares en español (`/servicio/:id`). Mantener consistencia en los slugs de las rutas.

## Archivos para revisar primero
- `src/main.jsx` — arranque de la app
- `src/App.jsx` — rutas y layout principal
- `src/context/CartContext.jsx` — estado global del presupuesto
- `src/componentes/*` y `src/paginas/*` — interfaz y páginas
- `public/data/servicios.json`, `public/data/personal.json` — datos canónicos de la app
- `vite.config.js`, `package.json`, `README.md`

## Configs existentes para asistentes AI
- No se detectaron archivos como CLAUDE.md, AGENTS.md, .cursorrules, .windsurfrules u otras configuraciones de asistentes. Si se agrega uno, incluir un resumen corto de las convenciones del proyecto y los comandos de build/test.

---

Si quieres que se amplíe alguna sección (tests, CI, reglas de ESLint, etc.), indica qué área y las sesiones de Copilot se adaptarán en consecuencia.

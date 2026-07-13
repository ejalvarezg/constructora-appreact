# Constructora Bricks S.A. — Sistema de Gestión de Presupuestos Edilicios

Este es un sistema web interactivo desarrollado con React JS y conectado a Google Firebase. Está diseñado para centralizar, relevar y administrar solicitudes de presupuesto para reparaciones, refacciones y mantenimiento edilicio en propiedades horizontales (consorcios), comercios y unidades particulares.

El objetivo principal de la aplicación es solucionar la recolección desorganizada de información ante incidentes técnicos. Permite que los clientes detallen las necesidades de sus inmuebles de forma estructurada antes de coordinar la visita técnica y, en paralelo, provee un entorno administrativo privado y autenticado para que el personal de la constructora gestione el catálogo de rubros en tiempo real.

---

## Características Principales e Implementaciones Técnicas

La aplicación cumple con los siguientes requerimientos:

### 1. Gestión del Carrito y Estado Global (Context API)

- **Presupuesto Centralizado (`CartContext`):** Implementación de un contexto global de React que gestiona los servicios agregados por el cliente. Evita la duplicidad de ítems mediante funciones de validación en tiempo real (`isInCart`), permitiendo añadir, remover de forma individual (`removeItem`) o vaciar el presupuesto con un solo clic.
- **Persistencia e Interfaz Reactiva:** Indicadores visuales en la barra de navegación (badges interactivos) que reflejan instantáneamente el volumen de servicios seleccionados.

### 2. Autenticación de Usuarios y Seguridad (Firebase Auth)

- **Seguridad Global (`AuthContext`):** Manejo centralizado del estado de la sesión (usuario logueado o visitante anónimo) escuchando directamente los eventos asíncronos de Firebase Authentication.
- **Rutas Privadas (`Protected Routes`):** Bloqueo a nivel de enrutador mediante un componente guardián (`<RutaProtegida>`). Cualquier intento de acceso forzado por URL hacia el área de administración rebota de forma automática al formulario de Login.
- **Interfaz Condicional:** El menú de navegación oculta de forma inteligente los enlaces de gestión técnica a los clientes comunes, mostrándolos únicamente cuando un administrador válido ha sido autenticado.

### 3. Ciclo CRUD Completo en la Nube (Firebase Firestore)

- **Lectura Dinámica (Read):** Sincronización asíncrona con colecciones de Firestore para listar el catálogo general público y la tabla para gestión interna.
- **Alta de Servicios (Create):** Formulario que inyecta nuevos servicios en la base de datos utilizando `addDoc`.
- **Modificación de Registros (Update):** Sistema interactivo que llena el formulario automáticamente al pulsar "Editar", aplicando un desplazamiento suave en pantalla (`scrollIntoView`) y actualizando mediante `updateDoc`.
- **Eliminación Segura (Delete):** Remoción física de documentos con `deleteDoc`, precedida por una alerta de confirmación de resguardo para mitigar errores accidentales de UX.

### 4. Optimización UX/UI y Diseño Responsivo

- **Feedback Asíncrono:** Spinners e indicadores gráficos de carga CSS que notifican al usuario mientras se resuelven las peticiones con los servidores de Firebase.
- **Adaptabilidad Móvil:** Arquitectura de maquetación construida sobre módulos de CSS independientes (`.module.css`) empleando Flexbox y Media Queries, asegurando compatibilidad multiplataforma en smartphones, tablets y ordenadores.

---

## 💻 Instalación y Ejecución en Entorno Local

Para descargar el proyecto, compilar sus dependencias en desarrollo y ejecutarlo localmente, ejecute la siguiente secuencia de comandos desde su terminal:

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/ejalvarezg/constructora-appreact.git](https://github.com/ejalvarezg/constructora-appreact.git)
   
   ```

2. **Ingresar al directorio raíz del proyecto:**
```bash
cd constructora-appreact
```

3. **Instalar el árbol de dependencias:**
   Este comando inspeccionará el archivo `package.json` y descargará de forma segura las librerías necesarias (incluyendo React, React Router Dom y Firebase).

```bash
npm install

```

4. **Iniciar el servidor de desarrollo local (Vite):**

```bash
npm run dev

```

5. **Visualizar la aplicación:**
   Abra su navegador predeterminado e ingrese a la dirección local provista por la terminal (por defecto, `http://localhost:5173`).


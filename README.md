# Constructora Bricks — Sistema de Gestión de Presupuestos Edilicios

Este es un sistema web interactivo de una constructora ficticia, diseñado para centralizar, relevar y gestionar solicitudes de presupuesto para reparaciones y mantenimiento en propiedades horizontales, comercios y unidades particulares.

El objetivo principal de la aplicación es solucionar la recolección desorganizada de información ante un problema edilicio. Permite que los clientes detallen las necesidades de sus inmuebles de forma estructurada antes de coordinar la visita técnica. De este modo, el especialista recibe datos precisos sobre el estado general de la propiedad, optimizando la comunicación y asegurando que la inspección en el lugar sea mucho más eficiente.

---

## Características Principales

* **Catálogo por Rubros:** Listado de servicios ofrecidos que incluye Impermeabilizaciones, Plomería, Electricidad, Gas, Pintura, Herrería y Carpintería.
* **Formularios Dinámicos de Relevamiento:** Cada rubro seleccionado tiene preguntas específicas (como superficies estimadas, ubicación de las filtraciones, o si se requiere acceso con silleta) basadas en los requerimientos del inspector.
* **Consolidación del Pedido:** Un panel centralizado donde el usuario visualiza todos los rubros agregados, detalla el problema particular de cada uno de ellos de forma individual y completa los datos de contacto y la ubicación del inmueble para agendar la visita física.
* **Interfaz Adaptativa:** Diseñado con un sistema modular que garantiza que un administrador de consorcios o propietario pueda realizar la solicitud cómodamente tanto desde una computadora de escritorio o desde su teléfono celular.

---

## Estructura de Carpetas

El código está organizado de forma modular e intuitiva para facilitar su mantenimiento:

```
src/
├── componentes/          
│   ├── Header/           
│   ├── Navbar/           
│   ├── Layout/           
│   ├── ServicioCard/     
│   └── TarjetasMiembros/ 
├── context/              
├── paginas/              
│   ├── Inicio/           
│   ├── Servicios/        
│   ├── ServicioDetalle/  
│   └── Carrito/          
├── App.jsx               
└── main.jsx              
```

---

## Notas sobre el funcionamiento de la app

### 1. Contexto para el carrito
Pasar datos a través de componentes intermedios que no necesitan procesar esa información puede generar potenciales rupturas en puntos donde alguna prop deje de transmitirse.

Para solucionar esto, se provee un contexto global (`CartContext`). Esto permite a cualquier componente acceder al contexto del carrito sin importar dónde se encuentre localizado. Algunos ejemplos de esto son:
* **La Página de Servicios** se conecta para avisar qué rubro quiere añadir el usuario y bloquear el botón si ya fue agregado, evitando duplicados.
* **La Barra de Navegación (Navbar)** consulta esta información para actualizar al instante el contador de servicios agregados en el botón "Mi Presupuesto".
* **La página de Presupuesto (Carrito)** toma la lista consolidada de servicios elegidos para mostrar los formularios correspondientes.

### 2. Carga de Datos
La aplicación simula el comportamiento de un servidor real. Por ahora, los datos se guardan por separado en archivos externos (`servicios.json` y `personal.json`).

Cuando la página se abre, los componentes solicitan y leen estos archivos de forma automática en segundo plano, permitiendo actualizar el catálogo o el equipo técnico del pie de página editando únicamente los archivos de datos, sin tocar el código de la interfaz.

---

## Instalación y Ejecución en Entorno Local

Para descargar el proyecto, instalar sus dependencias de desarrollo y ejecutarlo localmente en una computadora, sigue estos pasos desde tu terminal:

1. **Clonar el repositorio:**
```
   git clone https://github.com/ejalvarezg/constructora-appreact.git](https://github.com/ejalvarezg/constructora-appreact.git)
```

2. **Ingresar a la carpeta del proyecto:**
```
cd constructora-appreact
```


3. **Instalar dependencias:**
Este comando leerá las configuraciones y descargará todos los paquetes requeridos por la aplicación para funcionar adecuadamente.
```
npm install
```


4. **Iniciar el servidor de desarrollo local:**
```
npm run dev
```


5. **Abrir la aplicación:**
Una vez iniciado el servidor, la terminal te indicará una dirección web local (por lo general `http://localhost:5173`). Copiá esa dirección en tu navegador para probar el sistema.
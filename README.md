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
constructora-bricks/
├── public/
│   └── data/
│       ├── personal.json
│       └── servicios.json
├── src/
│   ├── componentes/
│   │   ├── Header/
│   │   ├── Navbar/
│   │   ├── Layout/
│   │   ├── ServicioCard/
│   │   └── TarjetasMiembros/
│   ├── context/
│   │   └── CartContext.jsx
│   ├── paginas/
│   │   ├── Inicio/
│   │   ├── Servicios/
│   │   ├── ServicioDetalle/
│   │   └── Carrito/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md            
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
   git clone https://github.com/ejalvarezg/constructora-appreact.git
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




# OTRA COSA


Actuá como un Administrador de Bases de Datos (DBA) y Arquitecto de Software experto en PostgreSQL. Necesito diseñar el modelo relacional físico (script DDL completo) para un sistema de gestión de Propiedad Horizontal (Administración de Consorcios) que utiliza una arquitectura limpia.

El diseño debe ser multi-consorcio y soportar de forma estricta las siguientes reglas de negocio y entidades que ya tengo estructuradas a nivel lógico:

1. INFRAESTRUCTURA FÍSICA Y LEGAL:
   - consorcios: id, razon_social, cuit, clave_suterh, direccion, datos_bancarios (pueden ser campos o un JSONB para múltiples cuentas).
   - unidades_funcionales: id, consorcio_id, numero_unidad, piso, metros_cuadrados, porcentaje_participacion (NUMERIC/DECIMAL para el prorrateo de expensas).

2. RELACIONES MUCHOS A MUCHOS (N:N) CON ATRIBUTOS (Usuarios y Roles):
   - personas: id, nombre, apellido, dni, email, telefono, password_hash. Los datos personales son únicos y globales.
   - vinculos_consorcio (Tabla intermedia N:N): Un usuario puede tener diferentes roles en diferentes unidades o edificios en simultáneo (ej: propietario en el Consorcio A, inquilino en el Consorcio B). 
   - Esta tabla debe unir 'persona_id' con 'unidad_funcional_id' e incluir un campo 'tipo_rol' de tipo ENUM o con un CHECK para los valores: ('Administrador', 'Propietario', 'Inquilino', 'Consejo'). Añadir un CONSTRAINT UNIQUE compuesto para evitar duplicados del mismo rol en la misma unidad.

3. MANTENIMIENTO, RECLAMOS Y PROVEEDORES:
   - proveedores: id, razon_social, cuit, gremio_tecnico (plomero, electricista, ascensorista, etc.), telefono, email.
   - consorcios_proveedores (Tabla intermedia N:N): Vincula qué proveedores trabajan para qué consorcios.
   - sectores_comunes: id, consorcio_id, nombre_sector (ej: "Ascensor N°1", "Caldera Central", "SUM", "Palieres").
   - reclamos: id, persona_id (quien reclama), unidad_funcional_id (nullable), sector_comun_id (nullable), descripcion, estado ('Pendiente', 'En Revisión', 'Proveedor Asignado', 'Solucionado'), fecha_creacion.
   * REQUISITO: Si la falla es en un sector común, 'unidad_funcional_id' queda en NULL. Si es dentro de un departamento, 'sector_comun_id' queda en NULL.
   - presupuestos: id, reclamo_id, proveedor_id, valor_total, cantidad_cuotas, estado ('Pendiente', 'Aprobado', 'Rechazado').

4. LOGÍSTICA FINANCIERA (Gastos, Liquidaciones y Cuentas Corrientes):
   - gastos_devengados: id, consorcio_id, concepto, monto, tipo_fondo ('Ordinario', 'Extraordinario', 'Fondo Especial Cocheras'), periodo_liquidacion (mes/año). Puede vincularse a un 'sector_comun_id' de forma opcional si el gasto derivó de allí.
   - liquidaciones_expensas (Histórico Inmutable): Actúa como un cierre de caja mensual por consorcio. Registra el total de gastos ordinarios/extraordinarios de ese mes y el saldo deudor consolidado a la fecha de emisión.
   - cuenta_corriente_unidades (Estado Vivo): Tabla que registra los movimientos en tiempo real por unidad funcional (emisión de expensa como saldo en contra, cobro de intereses, e ingresos por pagos mediante recibos).
   - pagos_recibos: id, unidad_funcional_id, monto, fecha_pago, forma_pago. Impacta directamente en la cuenta corriente viva.

¿QUÉ NECESITO QUE GENERES?
1. El script DDL de PostgreSQL completo, ordenado secuencialmente para que no haya conflictos de llaves foráneas.
2. El uso de tipos de datos correctos (ej: NUMERIC para dinero y porcentajes, TIMESTAMPTZ para fechas con zona horaria, ENUMs o CHECKs donde corresponda).
3. Todas las llaves primarias, foráneas (con sus respectivas reglas ON DELETE si aplican) y restricciones UNIQUE compuestas necesarias.
4. Una función en PL/pgSQL (STORED PROCEDURE o TRIGGER) que sirva como ejemplo pedagógico de automatización para calcular el prorrateo básico de una expensa ordinaria: debe tomar el total de gastos ordinarios de un consorcio para un período y calcular el monto correspondiente para una unidad funcional multiplicando ese total por su 'porcentaje_participacion'.

Utilizá nomenclatura estándar de bases de datos profesionales (snake_case) y agregá comentarios breves en las tablas principales.
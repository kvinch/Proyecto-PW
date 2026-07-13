# 4. Descripción Técnica de la Aplicación

## 4.1 Tecnologías utilizadas

La aplicación ha sido desarrollada como un proyecto frontend con base en React y JavaScript, utilizando Vite como herramienta de construcción y ejecución en entorno de desarrollo. De acuerdo con el archivo `package.json`, las principales tecnologías y librerías empleadas son las siguientes:

- `react` y `react-dom`: utilizadas para la construcción de la interfaz de usuario basada en componentes.
- `react-router-dom`: empleada para la navegación entre pantallas mediante rutas.
- `tailwindcss` y `@tailwindcss/vite`: utilizadas para el diseño visual y la aplicación de estilos utilitarios.
- `lucide-react`: biblioteca de iconos usada en botones, tarjetas, tablas, alertas e indicadores visuales.
- `ogl`: librería gráfica utilizada en el módulo visual de partículas del componente de login.
- `eslint`: utilizada para el análisis estático del código durante el desarrollo.

Adicionalmente, el proyecto utiliza:

- `Vite`, configurado en `vite.config.js`, como entorno de desarrollo y empaquetado.
- `src/index.css`, que importa Tailwind CSS como base global de estilos.

No se evidencia el uso de Bootstrap, Redux, Context API activa, bases de datos, backend ni APIs remotas como parte del flujo principal de la aplicación.

## 4.2 Estructura general del proyecto

La estructura del proyecto se organiza principalmente en torno a carpetas de componentes y páginas. A nivel general, se identifican los siguientes directorios y archivos relevantes:

- `src/`: contiene el punto de entrada principal de la aplicación y las páginas enrutadas.
- `src/pages/`: incluye las pantallas principales del sistema, tales como `dashboardPage.jsx`, `inventarioPage.jsx`, `entradasPage.jsx`, `salidasPage.jsx`, `usuarioPage.jsx`, `registroUsuarioPage.jsx`, `inicioPage.jsx` e `inventarioResumenPage.jsx`.
- `components/`: agrupa los componentes reutilizables y funcionales del sistema, organizados por módulo.
- `components/Usuarios/`: contiene `Usuarios.jsx`, `RegistroUsuario.jsx`, `ItemUsuario.jsx` y `UsuariosTable.jsx`.
- `components/Inventario/`: contiene `Inventario.jsx`, `RegistroProducto.jsx` e `ItemProducto.jsx`.
- `components/Entradas/`: contiene `Entradas.jsx` y `TablaEntradas.jsx`.
- `components/Salidas/`: contiene `Salidas.jsx`.
- `components/Sidebar/`: contiene `Sidebar.jsx`, encargado de la navegación lateral.
- `components/Login/`: contiene `Login.jsx`, `FondoParticulas.jsx` y `Particles.jsx`.
- `src/assets/`: almacena recursos estáticos como imágenes e íconos.
- `public/`: contiene archivos públicos como `favicon.svg` e `icons.svg`.
- `src/hooks/`: contiene el archivo `useFetch.js`, aunque este hook no forma parte del flujo principal actualmente observado.

No se identifican carpetas específicas llamadas `data`, `mocks`, `context` o `routes`. En lugar de ello, los datos simulados se definen directamente dentro de algunos componentes mediante constantes locales y se almacenan en `localStorage`.

## 4.3 Componentes principales utilizados

La aplicación se apoya en una arquitectura basada en componentes funcionales. Entre los componentes principales identificados se encuentran los siguientes:

- `Sidebar` (`components/Sidebar/Sidebar.jsx`): componente de navegación lateral persistente. Muestra el menú principal del sistema y permite desplazarse entre módulos como Inicio, Dashboard, Entradas, Salidas, Productos, Inventario y Gestión de Usuarios.
- `Usuarios` (`components/Usuarios/Usuarios.jsx`): componente principal del módulo de usuarios. Gestiona la lista de usuarios, la búsqueda, el filtrado por rol y estado, la eliminación y el cambio de estado.
- `RegistroUsuario` (`components/Usuarios/RegistroUsuario.jsx`): formulario para registrar y editar usuarios.
- `ItemUsuario` (`components/Usuarios/ItemUsuario.jsx`): representa una fila individual dentro de la tabla de usuarios.
- `UsuariosTable` (`components/Usuarios/UsuariosTable.jsx`): componente de tabla de usuarios existente en el proyecto, aunque no se encuentra integrado al flujo principal actual.
- `Inventario` (`components/Inventario/Inventario.jsx`): componente principal del módulo de productos. Permite listar, filtrar y eliminar productos, así como visualizar su estado de stock.
- `RegistroProducto` (`components/Inventario/RegistroProducto.jsx`): formulario de registro y edición de productos.
- `ItemProducto` (`components/Inventario/ItemProducto.jsx`): representa cada fila de producto en la tabla del inventario e incorpora indicadores visuales de stock.
- `Entradas` (`components/Entradas/Entradas.jsx`): componente principal para el registro de entradas de productos al almacén.
- `TablaEntradas` (`components/Entradas/TablaEntradas.jsx`): tabla de historial de entradas con filtros por búsqueda y responsable.
- `Salidas` (`components/Salidas/Salidas.jsx`): componente encargado del registro de salidas y de la visualización del historial de movimientos de salida.
- `Login` (`components/Login/Login.jsx`): interfaz visual de acceso al sistema.
- `FondoParticulas` y `Particles` (`components/Login/`): componentes visuales que generan el fondo animado de la pantalla de login.

En términos arquitectónicos, la mayoría de los módulos sigue una separación por responsabilidad entre componente contenedor, formulario y tabla o ítem. Sin embargo, el módulo `Salidas` concentra varias responsabilidades en un solo archivo.

## 4.4 Pantallas principales de la aplicación

### Dashboard

La pantalla `dashboardPage.jsx` presenta una vista resumida del estado operativo del almacén. Muestra:

- número total de productos;
- stock total acumulado;
- cantidad de entradas registradas;
- cantidad de salidas registradas;
- tabla con el estado de stock por producto;
- listado de movimientos recientes;
- alerta visual cuando existen productos en estado crítico.

Esta pantalla obtiene la información directamente desde `localStorage`, leyendo principalmente las claves `inventario_app`, `entradas_app` y `salidas_app`.

### Usuarios

La pantalla `usuarioPage.jsx` carga el componente `Usuarios`, el cual permite:

- visualizar la lista de usuarios;
- buscar usuarios por nombre o nombre de usuario;
- filtrar por rol y estado;
- activar o inactivar usuarios;
- eliminar registros;
- navegar hacia el formulario de creación o edición.

La pantalla de formulario correspondiente es `registroUsuarioPage.jsx`, que renderiza el componente `RegistroUsuario`.

### Inventario

La pantalla `inventarioPage.jsx` renderiza el componente `Inventario`, que permite:

- listar productos registrados;
- buscar por nombre;
- filtrar por categoría;
- filtrar por nivel de stock;
- detectar productos en estado crítico;
- eliminar productos;
- navegar al formulario de creación y edición.

El formulario se implementa mediante `RegistroProducto.jsx`, utilizado tanto para creación como para modificación de productos.

### Entradas

La pantalla `entradasPage.jsx` muestra el componente `Entradas`, el cual permite registrar el ingreso de productos al almacén. Además del formulario, incorpora:

- tarjetas de resumen de movimientos;
- total de unidades ingresadas;
- indicador de stock crítico;
- historial de entradas mediante `TablaEntradas`.

Cada nueva entrada incrementa el stock del producto correspondiente en el inventario almacenado localmente.

### Salidas

La pantalla `salidasPage.jsx` renderiza el componente `Salidas`. En esta sección se registran las salidas de productos y se visualiza su historial. El módulo incluye:

- formulario de salida;
- validación de stock disponible;
- resumen de movimientos;
- conteo de unidades despachadas;
- indicador de stock crítico;
- filtros por búsqueda, motivo y rango de fechas.

Cada salida descuenta unidades del stock del producto seleccionado y actualiza simultáneamente el historial de salidas.

### Login

El proyecto contiene una pantalla de login en `components/Login/Login.jsx` y un archivo `src/pages/loginPage.jsx`. Sin embargo, esta pantalla no forma parte de las rutas activas configuradas en `src/main.jsx`. Por tanto, puede considerarse una vista visual existente, pero no integrada al flujo principal de navegación actual.

## 4.5 Manejo de rutas y navegación

La navegación entre páginas se gestiona mediante `react-router-dom`. El archivo principal de enrutamiento es `src/main.jsx`, donde se definen rutas con `BrowserRouter`, `Routes`, `Route` y `Navigate`.

Entre las rutas identificadas se encuentran:

- `/Inicio`
- `/Dashboard`
- `/Inventarios`
- `/Inventarios/nuevo`
- `/Inventarios/editar/:id`
- `/Entradas`
- `/Salidas`
- `/Historial De Movimientos`
- `/usuarios`
- `/usuarios/nuevo`
- `/usuarios/editar/:id`

La ruta raíz `/` redirige hacia `/usuarios`.

La navegación se realiza de dos formas:

- mediante el componente `Sidebar`, que utiliza `Link` para el desplazamiento lateral entre módulos;
- mediante `useNavigate`, usado en pantallas y componentes para redirecciones programáticas, por ejemplo al registrar un nuevo usuario, editar un producto o acceder al dashboard.

En consecuencia, la aplicación se comporta como una SPA (Single Page Application), donde el cambio de pantalla no recarga completamente la página.

## 4.6 Manejo de datos simulados

El sistema funciona exclusivamente como frontend y utiliza datos simulados sin conexión a backend. El manejo de datos se realiza principalmente mediante dos mecanismos:

### 1. Datos mock iniciales

Algunos módulos definen arreglos de datos de ejemplo dentro del propio componente. Entre ellos se encuentran:

- `usuariosMock` en `components/Usuarios/Usuarios.jsx`
- `productosMock` en `components/Inventario/Inventario.jsx`
- `salidasMock` en `components/Salidas/Salidas.jsx`

Estos arreglos sirven para inicializar la aplicación cuando no existen datos previos almacenados.

### 2. Persistencia local con `localStorage`

La aplicación guarda y recupera la información utilizando claves del navegador, entre ellas:

- `usuarios_app`
- `inventario_app`
- `entradas_app`
- `salidas_app`

Este enfoque permite simular persistencia de datos entre recargas del navegador, aun cuando no exista base de datos real.

No se identifican servicios API, archivos JSON externos ni un módulo centralizado de mocks. La simulación se implementa directamente dentro de los componentes.

## 4.7 Formularios, tablas, filtros y validaciones

Los formularios del sistema se implementan mediante componentes funcionales con `useState` para controlar el estado local de los campos. Este patrón se observa en módulos como `RegistroUsuario`, `RegistroProducto`, `Entradas` y `Salidas`.

### Formularios

Los formularios permiten crear o editar registros de usuarios, productos, entradas y salidas. En general:

- los campos están enlazados al estado del componente;
- el envío se controla mediante funciones locales;
- después de guardar, se actualiza `localStorage`;
- en algunos casos se redirige automáticamente a la pantalla principal del módulo.

### Tablas

Las tablas se utilizan para mostrar listados de usuarios, productos, entradas, salidas y resumen de inventario. Ejemplos claros son:

- `ItemUsuario.jsx` para las filas de usuarios;
- `ItemProducto.jsx` para las filas de productos;
- `TablaEntradas.jsx` para el historial de entradas;
- las tablas embebidas en `Salidas.jsx`, `Inventario.jsx`, `Usuarios.jsx`, `dashboardPage.jsx` e `inventarioResumenPage.jsx`.

### Filtros

El sistema incorpora filtros de búsqueda y selección en varios módulos:

- en usuarios: búsqueda por nombre o usuario, filtro por rol y estado;
- en inventario: búsqueda por producto, filtro por categoría y nivel de stock;
- en entradas: búsqueda por producto y filtro por responsable;
- en salidas: búsqueda por producto, filtro por motivo y rango de fechas.

### Validaciones

Las validaciones son principalmente del lado del cliente. Entre las validaciones observadas se encuentran:

- verificación de campos obligatorios vacíos;
- validación de cantidades numéricas y mayores que cero;
- prevención de stock negativo en las salidas;
- control de nombres de usuario duplicados;
- control de nombres de producto duplicados;
- validación de números positivos en stock y stock mínimo.

### Alertas visuales y mensajes

El sistema utiliza:

- `alert()` para informar errores o confirmaciones de operación;
- `window.confirm()` para confirmar eliminaciones;
- badges de color, botones y tarjetas para representar estados visuales;
- íconos de `lucide-react` para reforzar la interpretación de acciones y alertas.

## 4.8 Control de stock crítico

El control de stock crítico constituye una de las funciones más importantes del sistema. Su lógica se basa en comparar el stock actual de cada producto con su valor mínimo permitido (`stockMinimo`).

En términos funcionales:

- un producto es considerado crítico cuando `stock <= stockMinimo`;
- esta condición se calcula en componentes como `Inventario.jsx`, `ItemProducto.jsx`, `dashboardPage.jsx`, `inventarioResumenPage.jsx`, `Entradas.jsx` y `Salidas.jsx`;
- el estado crítico se comunica mediante colores, badges y alertas visuales.

En el módulo de inventario, por ejemplo, se incorpora un banner superior que informa cuántos productos se encuentran en estado crítico y permite filtrar rápidamente dichos casos. Asimismo, en `ItemProducto.jsx` se representa el nivel de stock mediante barras visuales y etiquetas como `CRÍTICO`, `EN RIESGO` y `NORMAL`.

El dashboard también resume el número de productos críticos y dirige al usuario al módulo de inventario cuando se requiere revisión.

## 4.9 Control visual de roles y permisos

El proyecto sí presenta manejo visual de roles, pero no evidencia un sistema completo de autorización o restricción real de acceso por rutas.

Se observan los siguientes elementos:

- en `Usuarios.jsx`, cada usuario posee atributos como `rol` y `estado`;
- en `ItemUsuario.jsx` se muestran badges diferenciados para roles como `Administrador`, `Supervisor` y `Operario`;
- en `RegistroUsuario.jsx` es posible asignar y editar el rol del usuario;
- en `Sidebar.jsx` aparece un bloque visual inferior con el texto `TIPO DE USUARIO` y `USUARIO`.

No obstante, no se encontró lógica que oculte rutas, bloquee pantallas o restrinja acciones según el rol del usuario autenticado. Por ello, puede afirmarse que el control de roles actualmente es principalmente visual y de registro de información, pero no de seguridad funcional.

## 4.10 Resumen técnico general

Desde una perspectiva técnica, la aplicación corresponde a un sistema frontend desarrollado con React, organizado en componentes funcionales y pantallas enrutadas con `react-router-dom`. Su propósito es simular la gestión de almacén de una empresa constructora mediante módulos de usuarios, inventario, entradas, salidas, dashboard y resumen de stock.

La arquitectura implementada combina:

- componentes de interfaz reutilizables;
- formularios controlados con estado local;
- persistencia simulada mediante `localStorage`;
- datos mock embebidos en componentes;
- navegación SPA con rutas internas;
- indicadores visuales apoyados en Tailwind CSS y `lucide-react`.

En términos de implementación, el proyecto cumple adecuadamente con el enfoque de una aplicación solo frontend, ya que no depende de backend ni de base de datos externa. Además, integra mecanismos básicos de validación, filtrado, visualización de estados y simulación de movimientos de inventario.

Finalmente, se observa que el sistema presenta una base funcional clara y académicamente válida para un proyecto universitario de frontend. No obstante, algunos elementos aún pueden considerarse parciales o no integrados, como la pantalla de login y el control real de permisos por rol, los cuales existen de forma visual pero no operan como mecanismos completos de autenticación o autorización.

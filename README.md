# Sistema de Gestión de Inventario de una empresa constructora

Proyecto universitario orientado a la administración y control de inventarios. Esta es una empresa constructura, por ello, todos los inventarios serán en relación a eso.

# División del Proyecto en 5 Módulos

## Gestión de Usuarios

### Requisitos asignados

* RF-05 Registro de Usuarios
* RF-06 Edición de Usuarios
* RF-07 Desactivación de Cuentas
* RF-08 Búsqueda y Filtros de Usuarios
* Apoyo visual al RF-09 Restricción por Rol

### Archivos principales

```txt id="6o6x5q"
/pages/Usuarios.jsx
```

### Funcionalidades

* Tabla de usuarios.
* Registro de nuevos usuarios.
* Edición de usuarios.
* Desactivación de cuentas.
* Filtros por:

  * Nombre
  * Rol
  * Estado (Activo / Inactivo)
* Validaciones visuales de campos obligatorios.
* Restricción visual de botones según permisos del rol.

---

## Inventario / Productos

### Requisitos asignados

* RF-10 Registro de Equipos y Materiales
* RF-11 Edición de Productos
* RF-12 Consulta de Inventario con Filtros
* RF-13 Alerta de Stock Crítico

### Archivos principales

```txt id="v5c50w"
/pages/Inventario.jsx
```

### Funcionalidades

* Tabla de productos, equipos o materiales.
* Registro de productos.
* Edición de productos.
* Filtros por:

  * Nombre
  * Categoría
  * Nivel de stock
* Visualización de stock actual y stock mínimo.
* Alertas visuales de stock crítico.

---

## Entradas de Inventario

### Requisitos asignados

* RF-14 Registro de Entradas
* Parte de RF-16 Actualización Automática
* RF-17 Vista Filtrada de Entradas

### Archivos principales

```txt id="n9z42d"
/pages/Entradas.jsx
/pages/HistorialEntradas.jsx
```

### Funcionalidades

* Formulario para registrar entradas.
* Campos:

  * Producto
  * Cantidad
  * Proveedor
  * Responsable
  * Fecha
  * Observación
* Simulación de aumento de stock al registrar entradas.
* Historial de entradas.
* Filtros por:

  * Rango de fechas
  * Responsable
  * Tipo de producto o material.

---

## Salidas de Inventario

### Requisitos asignados

* RF-15 Registro de Salidas
* Parte de RF-16 Actualización Automática
* RF-18 Vista Filtrada de Salidas

### Archivos principales

```txt id="ixj5kr"
/pages/Salidas.jsx
/pages/HistorialSalidas.jsx
```

### Funcionalidades

* Formulario para registrar salidas.
* Campos:

  * Producto
  * Cantidad
  * Motivo
  * Destino
  * Responsable
  * Fecha
  * Observación
* Validación de stock disponible.
* Simulación de disminución de stock.
* Historial de salidas.
* Filtros por:

  * Rango de fechas
  * Motivo
  * Material retirado
  * Destino.

---

## Dashboard, Permisos e Integración Visual

### Requisitos asignados

* RF-09 Restricción por Rol
* Apoyo al RF-13 Alertas de Stock Crítico
* Apoyo al RF-16 Actualización Automática
* Dashboard general
* Integración final de módulos

### Archivos principales

```txt id="h0v7n7"
/pages/Dashboard.jsx
/components/RoleGuard.jsx
/components/PermissionButton.jsx
/components/StockAlert.jsx
/components/SummaryCard.jsx
```

### Funcionalidades

* Dashboard con tarjetas resumen:

  * Total de usuarios
  * Total de productos
  * Productos en stock crítico
  * Total de entradas
  * Total de salidas
* Resumen visual de stock crítico.
* Control de permisos por rol.
* Componentes reutilizables para restricciones visuales.
* Integración de rutas finales.
* Revisión visual de diseño entre módulos.
* Pruebas de navegación.


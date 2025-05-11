# Urbia - Visor 3D y Buscador de Calles

Proyecto de simulación urbana con gemelo digital en 3D y buscador interactivo de calles basado en Leaflet.

## 📦 Requisitos Previos

- Node.js y NPM instalados en el sistema  
  👉 [https://nodejs.org]

## 🚀 Instalación del Proyecto

1. Clona o copia este proyecto en tu equipo.
2. Abre una terminal en la carpeta raíz del proyecto (donde está `package.json`).

### 1. Instalar las dependencias:

npm install

Esto instalará:
- Vite (entorno de desarrollo)
- Three.js (motor 3D)
- Cualquier otra dependencia definida en `package.json`

### 2. Ejecutar el proyecto en modo desarrollo:

npm run dev


Esto levantará un servidor local.  
La terminal te mostrará una URL como esta:

Local:   http://localhost:5173/


Abre esa URL en tu navegador para ver el proyecto funcionando.
---

## 🗂️ Estructura del Proyecto

```
/src
  ├── visor3d.js        # Lógica del visor 3D
  ├── visor3d.css       # Estilos del visor 3D
  ├── buscadorCalles.js # Lógica del buscador de calles
  ├── buscadorCalles.css# Estilos del buscador de calles

/public
  ├── index.html        # Página de inicio
  ├── visor3d.html      # Página del visor 3D
  ├── buscadorCalles.html# Página del buscador de calles
```

---

## ✅ Funcionalidades

- **Visor 3D**:  
  - Visualiza edificios, parques y calles.
  - Muestra panel de información al hacer clic.
  - Permite modificar el tipo de terreno y ver el impacto ambiental.

- **Buscador de Calles**:
  - Busca calles de Valladolid por nombre.
  - Muestra ubicación y condiciones climáticas simuladas.
  - Centra el mapa y muestra información detallada.

---

## 📝 Notas

- Para volver a instalar desde cero, elimina `node_modules` y ejecuta `npm install` de nuevo.
- Puedes personalizar calles o terrenos editando los archivos JS correspondientes.

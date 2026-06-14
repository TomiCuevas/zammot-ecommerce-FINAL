# ZAMMOT – Frontend

**Alumno:** Cuevas Tomás Gonzalo  
**Materia:** Aplicaciones Web II  
**Entrega:** Cuarta entrega

---

## Descripción

Frontend del e-commerce ZAMMOT desarrollado con HTML, CSS y JavaScript Vanilla.  
Se comunica con el backend mediante Fetch API consumiendo una API REST en Express.js con MongoDB.

Implementa autenticación con JWT, control de stock en tiempo real, filtros dinámicos con debounce y una experiencia de usuario completa sin frameworks de JavaScript.

---

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript Vanilla (ES6+)
- Bootstrap 5
- Bootstrap Icons
- Fetch API
- LocalStorage (carrito y favoritos)
- SessionStorage (sesión del usuario y token JWT)

---

## Estructura de carpetas

```
Frontend/
├── pages/
│   ├── home.html
│   ├── destacados.html
│   ├── camisas.html
│   ├── trajes.html
│   ├── zapatos.html
│   ├── carrito.html
│   ├── favoritos.html
│   ├── miscompras.html
│   └── contacto.html
├── api/
│   ├── app.js
│   ├── auth.api.js
│   ├── product.api.js
│   └── sale.api.js
├── js/
│   ├── auth.js
│   ├── navbar.js
│   ├── carrito.js
│   ├── wishlist.js
│   ├── renderProducts.js
│   ├── ventas.js
│   ├── homeCarousel.js
│   └── dataPages.js
├── controllers/
│   ├── home.controller.js
│   ├── camisas.controller.js
│   ├── trajes.controller.js
│   ├── zapatos.controller.js
│   ├── destacados.controller.js
│   ├── miscompras.controller.js
│   └── contacto.controller.js
├── styles/
│   ├── css/
│   │   ├── styless.css
│   │   ├── destacados.css
│   │   ├── login.css
│   │   ├── Registro.css
│   │   └── contacto.css
│   └── img/
└── index.html
```

---

## Páginas

| Archivo | Descripción |
|---|---|
| `index.html` | Login |
| `Registro.html` | Registro de usuario |
| `home.html` | Página principal con carrusel y filtros |
| `destacados.html` | Productos destacados |
| `camisas.html` | Categoría camisas |
| `trajes.html` | Categoría trajes |
| `zapatos.html` | Categoría zapatos |
| `carrito.html` | Carrito de compras |
| `favoritos.html` | Lista de favoritos |
| `miscompras.html` | Historial de compras |
| `contacto.html` | Formulario de contacto |

---

## Módulos JavaScript

### APIs (`/api`)

- **app.js** → URL base del backend
- **auth.api.js** → Login y registro contra el backend
- **product.api.js** → Obtención de productos, categorías y filtros dinámicos
- **sale.api.js** → Creación de ventas e historial por usuario

### Scripts (`/js`)

- **auth.js** → Registro, login, logout, validaciones y toasts
- **navbar.js** → Navbar dinámica según sesión; resalta el ítem activo según la página actual
- **carrito.js** → Carrito por usuario, control de cantidades y proceso de compra
- **wishlist.js** → Sistema de favoritos por usuario
- **renderProducts.js** → Render dinámico de tarjetas de producto con control de stock
- **ventas.js** → Historial de compras del usuario logueado
- **homeCarousel.js** → Carrusel horizontal de productos destacados
- **dataPages.js** → Configuración de páginas para la navbar

### Controllers (`/controllers`)

Cada página tiene su propio controller que inicializa la lógica correspondiente al cargar el DOM.

---

## Funcionalidades

### Autenticación
- Registro de usuario con validación de campos y email.
- Login que recibe un token JWT del backend y lo almacena en `sessionStorage`.
- Logout limpia la sesión completamente.
- Navbar dinámica: muestra opciones distintas para usuarios logueados y visitantes.

### JWT
- El token recibido en el login se guarda en `sessionStorage` como `token`.
- Al realizar una compra, el token se envía en el header `Authorization: Bearer <token>`.
- El backend verifica el token antes de procesar la venta.

### Productos
- Render dinámico de cards consumiendo el backend.
- Control de stock numérico: el botón `+` no supera el stock disponible del producto.
- Badge "Sin stock" y botón deshabilitado cuando un producto no está disponible.
- Validación al agregar al carrito: muestra un toast si la cantidad supera el stock.

### Filtros (Home)
- Filtro por categoría (select).
- Filtro por precio mínimo y máximo (inputs numéricos).
- Ordenamiento: precio ascendente, precio descendente, nombre A-Z.
- Debounce de 500ms en los inputs de precio para evitar llamadas innecesarias al backend.
- Botón "Limpiar filtros" que resetea todos los campos.
- Todos los filtros se procesan desde el backend vía query params.

### Carrito
- Persistente por usuario en `localStorage`.
- Permite modificar cantidades por ítem.
- Cálculo de subtotal y total en tiempo real.
- La compra envía el token JWT al backend; si es inválido o expirado, la compra es rechazada.
- Si el stock es insuficiente al momento de pagar, el backend rechaza la operación con un mensaje descriptivo.
- Tras una compra exitosa se muestra un modal de confirmación y se vacía el carrito.

### Favoritos
- Sistema de wishlist persistente por usuario en `localStorage`.
- Contador dinámico en la navbar.

### Mis compras
- Consume el historial de ventas del usuario logueado desde el backend.
- Muestra fecha, total, dirección y productos de cada compra.

### Navegación
- El ítem activo de la navbar se resalta automáticamente según la página actual.

---

## Cómo ejecutar el proyecto

El proyecto está organizado en una única carpeta `ZAMMOT/` con dos subcarpetas:

```
ZAMMOT/
├── Backend/
└── Frontend/
```

### 1. Configurar el Backend

Dentro de `Backend/`, crear el archivo `.env` con las variables de entorno necesarias (ver README del Backend).

Instalar dependencias:

```
npm install
```

Poblar la base de datos:

```
npm run seed
```

Iniciar el servidor:

```
npm start
```

### 2. Abrir el Frontend

Abrir `Frontend/index.html` con un servidor local (por ejemplo Live Server en VS Code).

El frontend apunta a `http://localhost:3001` como backend.

---

## Notas

- El proyecto no utiliza archivos JSON como base de datos. Toda la persistencia se maneja en MongoDB Atlas.
- La comunicación cliente-servidor usa `fetch` con CORS habilitado.
- Las contraseñas nunca viajan ni se almacenan en texto plano.
- El token JWT expira a las 8 horas; al expirar se debe volver a iniciar sesión.
- El carrito y los favoritos se mantienen en `localStorage` por usuario (clave basada en el email).
- La sesión activa se mantiene en `sessionStorage` y se limpia al cerrar el navegador.

---

## Autor

Tomás Cuevas

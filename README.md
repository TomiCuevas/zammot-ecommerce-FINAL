# ZAMMOT E-Commerce
### Entrega Final — Aplicaciones Web II
**Tomás Cuevas · 2026**

---

## Enlaces del Proyecto

- 🔗 **Repositorio:** [https://github.com/TomiCuevas/zammot-ecommerce-FINAL](https://github.com/TomiCuevas/zammot-ecommerce-FINAL)
- 🎥 **Video explicativo:** [Ver video en Google Drive](https://drive.google.com/file/d/1z0LAoiHLRPzSIe6MtmdqYPfI9zWsldD9/view?usp=sharing)

---

## Descripción General

**ZAMMOT** es un e-commerce de indumentaria masculina formal construido sobre una arquitectura cliente-servidor desacoplada.

| Capa | Tecnología | Descripción |
|------|-----------|-------------|
| Frontend | HTML + CSS + JS Vanilla | Interfaz de usuario |
| Backend | Node.js + Express | API REST |
| Base de datos | MongoDB Atlas | Persistencia en la nube |

La comunicación sigue el patrón **REST**:
`Frontend` → HTTP Request → `Backend` → MongoDB → JSON Response → `Frontend`

---

## Arquitectura en Capas (Backend)

```
┌──────────────────────────────┐
│       CLIENTE (Browser)      │
└──────────────┬───────────────┘
               │ HTTP Request
┌──────────────▼───────────────┐
│   RUTAS (routes/)            │  ← Define endpoints y middlewares
└──────────────┬───────────────┘
               │
┌──────────────▼───────────────┐
│   ACCIONES (actions/)        │  ← Lógica de negocio
└──────────────┬───────────────┘
               │
┌──────────────▼───────────────┐
│   DATOS (schemas/ + MongoDB) │  ← Modelos Mongoose
└──────────────────────────────┘
```

---

## Modelos de Datos

### Usuario
| Campo | Tipo | Detalle |
|-------|------|---------|
| nombre, apellido | String | required |
| email | String | required, unique |
| password | String | hash bcrypt |
| activo | Boolean | default: true |
| direccion, fechaNac | String | opcionales |

### Producto
`id · title · price · category · stock · disponible`

### Venta
`id_usuario (ref) · productos[] · total · direccion · fecha`

---

## Endpoints de la API REST

**Base URL:** `http://localhost:3001`

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/users/create` | Registrar usuario | — |
| POST | `/users/login` | Login → devuelve JWT | — |
| PUT | `/users/update/:id` | Actualizar datos | — |
| DELETE | `/users/delete/:id` | Eliminar usuario + ventas | — |
| GET | `/products/` | Todos los productos | — |
| GET | `/products/filter` | Filtrar por precio/categoría | — |
| PUT | `/products/price/update/:id` | Actualizar precio | — |
| POST | `/sales/create` | Crear venta | 🔒 JWT |
| GET | `/sales/detail/:id` | Detalle de venta | — |
| POST | `/sales/user` | Historial de usuario | — |

---

## Sistema de Autenticación

### Flujo de Registro
```
Frontend → POST /users/create (password en texto plano)
Backend  → bcrypt.hash(password, 10)  ← hash irreversible
MongoDB  → guarda el hash (nunca la contraseña real)
```

### Flujo de Login
```
Frontend → POST /users/login
Backend  → bcrypt.compare(password, hash)
Backend  → jwt.sign({ id, email }, SECRET, { expiresIn: '8h' })
Frontend → sessionStorage.setItem('token', token)
```

### Flujo de Compra (ruta protegida 🔒)
```
Frontend  → POST /sales/create + Authorization: Bearer <token>
Middleware → verifyToken valida la firma del JWT
Backend   → si 401: frontend limpia sesión → redirige al login
```

---

## Control de Stock

Al confirmar una compra (`createSaleAction`):

1. Verifica que `product.stock >= qty` para cada producto
2. Si no hay stock → `400 INSUFFICIENT_STOCK`
3. Crea la venta en MongoDB
4. Descuenta con `$inc: { stock: -qty }`
5. Si stock llega a `0` → marca `disponible: false`

**Doble validación:**
- 🖥️ **Frontend**: no permite agregar más unidades que el stock real
- 🔒 **Backend**: rechaza la compra si el stock es insuficiente

---

## Gestión del Estado en el Frontend

**`sessionStorage`** — se borra al cerrar la pestaña
- `loggedUser` — datos del usuario autenticado
- `token` — JWT activo
- `loginMessage` — mensaje entre redirecciones

**`localStorage`** — persiste entre sesiones
- `cart_<email>` — carrito del usuario
- `sales_<email>` — historial local de compras
- `zammot_wishlist_<email>` — lista de favoritos

---

## Tecnologías

### Backend
| Paquete | Versión | Función |
|---------|---------|---------|
| `express` | ^5.2.1 | Framework web, rutas y middlewares |
| `mongoose` | ^9.7.0 | ODM para MongoDB, schemas y consultas |
| `bcryptjs` | ^3.0.3 | Hash irreversible de contraseñas |
| `jsonwebtoken` | ^9.0.3 | Generación y verificación de JWT |
| `dotenv` | ^17.4.2 | Variables de entorno (.env) |
| `cors` | ^2.8.6 | Comunicación entre puertos 5500 y 3001 |

**Configuración:** `"type": "module"` → ES Modules (`import`/`export`)

### Frontend (CDN)
| Librería | Versión | Uso |
|----------|---------|-----|
| Bootstrap CSS | 5.3.2 | Grilla, componentes, responsive |
| Bootstrap JS | 5.3.3 | Menú hamburguesa, interactividad |
| Bootstrap Icons | 1.13.1 | Iconos en navbar, productos, perfil |

### Herramientas de desarrollo
- **MongoDB Atlas** — base de datos NoSQL en la nube
- **VS Code + Live Server** — entorno de desarrollo (puerto 5500)
- **Postman** — pruebas de API REST
- **Git + GitHub** — control de versiones

---

## Mejoras Implementadas

| # | Mejora | Área |
|---|--------|------|
| 01 | Autenticación JWT + bcryptjs | Backend + Frontend |
| 02 | Control de stock en tiempo real | Backend + Frontend |
| 03 | Domicilio estructurado en registro | Frontend + Backend |
| 04 | Página de perfil editable | Frontend + Backend |
| 05 | Buscador de productos por texto | Frontend |
| 06 | Redirección automática por token expirado | Frontend |
| 07 | Sistema de toasts (reemplaza `alert()`) | Frontend |
| 08 | Estado activo en la navbar | Frontend |
| 09 | Validación mejorada en contacto | Frontend |
| 10 | Corrección warnings Mongoose deprecados | Backend |

### Detalle de mejoras principales

- **JWT + bcrypt** — contraseñas hasheadas, compras protegidas por token de 8h
- **Control de stock** — validación en frontend y backend, descuento atómico con `$inc`, marca `disponible: false` al llegar a 0
- **Perfil editable** — `PUT /users/update/:id` actualiza MongoDB y `sessionStorage` simultáneamente
- **Token expirado** — detección del `401`, limpieza de sesión y redirección al login con mensaje
- **Toasts** — reemplazo de `alert()` por notificaciones animadas, auto-eliminadas a los 2.2s

---

## Cómo ejecutar el proyecto

```bash
# 1. Clonar el repositorio
git clone https://github.com/TomiCuevas/zammot-ecommerce-FINAL.git

# 2. Instalar dependencias del Backend
cd Backend
npm install

# 3. Configurar variables de entorno
# Opción A: usar las credenciales incluidas (el .env ya está en el repo, no hace falta nada)
# Opción B: usar tu propia base de datos MongoDB Atlas:
cp .env.example .env
# Luego editar .env con tu MONGO_URI, JWT_SECRET y PORT

# 4. (Opcional) Poblar la base de datos
npm run seed

# 5. Iniciar el servidor
npm start
# → Servidor en http://localhost:3001

# 6. Abrir el Frontend
# Abrir Frontend/index.html con Live Server (puerto 5500)
```

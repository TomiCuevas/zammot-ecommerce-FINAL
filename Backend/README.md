# ZAMMOT – Backend

**Alumno:** Cuevas Tomás Gonzalo  
**Materia:** Aplicaciones Web II  
**Entrega:** Cuarta entrega

---

## Descripción

Backend del e-commerce ZAMMOT desarrollado con Node.js y Express.js.  
Gestiona usuarios, productos y ventas con persistencia en MongoDB Atlas mediante Mongoose ODM.

Implementa encriptación de contraseñas con bcryptjs y autenticación mediante JWT para proteger acciones clave como la compra.

---

## Tecnologías utilizadas

- Node.js
- Express.js
- MongoDB Atlas (base de datos no relacional en la nube)
- Mongoose (ODM)
- bcryptjs (encriptación de contraseñas)
- jsonwebtoken (autenticación JWT)
- dotenv (variables de entorno)
- CORS
- ES Modules (`"type": "module"`)

---

## Estructura de carpetas

```
Backend/
├── data/
│   ├── usuarios.json
│   ├── products.json
│   └── ventas.json
├── db/
│   ├── connection.js
│   ├── schemas/
│   │   ├── user.schema.js
│   │   ├── product.schema.js
│   │   └── sale.schema.js
│   └── actions/
│       ├── user.actions.js
│       ├── product.actions.js
│       └── sale.actions.js
├── middlewares/
│   └── verifyToken.js
├── routes/
│   ├── user.routes.js
│   ├── product.routes.js
│   └── sale.routes.js
├── index.js
├── seed.js
├── .env
└── package.json
```

---

## Variables de entorno

Crear un archivo `.env` en la raíz del Backend con las siguientes variables:

```
MONGO_URI=<cadena de conexión de MongoDB Atlas>
JWT_SECRET=<clave secreta para firmar tokens>
PORT=3001
```

---

## Instalación

Instalar dependencias:

```
npm install
```

Poblar la base de datos (importa usuarios, productos y ventas desde los JSON):

```
npm run seed
```

Iniciar el servidor:

```
npm start
```

Servidor disponible en:

```
http://localhost:3001
```

---

## Endpoints

---

### Usuarios

#### POST – Login

```
POST http://localhost:3001/users/login
```

Body:

```json
{
  "email": "tomas@gmail.com",
  "password": "1234"
}
```

Verifica las credenciales contra la base de datos.  
Compara la contraseña ingresada con el hash almacenado usando bcryptjs.  
Devuelve los datos del usuario y un token JWT con duración de 8 horas.

---

#### POST – Crear usuario

```
POST http://localhost:3001/users/create
```

Body:

```json
{
  "nombre": "Gonzalo",
  "apellido": "Bustos",
  "email": "bustos@gmail.com",
  "password": "1234",
  "direccion": "Av. Velez Sarsfield 78"
}
```

Registra un nuevo usuario en MongoDB.  
La contraseña se hashea automáticamente con bcryptjs antes de almacenarse.  
Devuelve código 201 si la creación es exitosa.  
Devuelve 409 si el email ya está registrado.

---

#### PUT – Actualizar usuario

```
PUT http://localhost:3001/users/update/:id
```

Body:

```json
{
  "direccion": "Nueva dirección 123"
}
```

Actualiza los datos de un usuario existente por su ID de MongoDB.

---

#### DELETE – Eliminar usuario

```
DELETE http://localhost:3001/users/delete/:id
```

Elimina un usuario y todas sus ventas asociadas (eliminación en cascada).

---

### Productos

#### GET – Listado completo

```
GET http://localhost:3001/products
```

Devuelve todos los productos de la base de datos.

---

#### GET – Filtrado dinámico

```
GET http://localhost:3001/products/filter
```

Filtra productos mediante query params. Parámetros disponibles:

| Parámetro  | Descripción                              | Ejemplo           |
|------------|------------------------------------------|-------------------|
| `category` | Filtra por categoría                     | `category=camisas`|
| `minPrice` | Precio mínimo                            | `minPrice=50000`  |
| `maxPrice` | Precio máximo                            | `maxPrice=200000` |
| `sortBy`   | Ordenamiento: `price_asc`, `price_desc`, `name_asc` | `sortBy=price_asc` |

Ejemplo combinado:

```
GET http://localhost:3001/products/filter?category=zapatos&minPrice=100000&maxPrice=300000&sortBy=price_asc
```

---

#### GET – Productos por categoría

```
GET http://localhost:3001/products/category/:category
```

Categorías disponibles: `camisas`, `trajes`, `zapatos`, `destacados`

---

#### GET – Producto más vendido

```
GET http://localhost:3001/products/most-sold
```

Devuelve el o los productos más vendidos según el historial de ventas.

---

#### PUT – Actualizar precio

```
PUT http://localhost:3001/products/price/update/:id
```

Body:

```json
{
  "price": 150000
}
```

Actualiza el precio de un producto y recalcula automáticamente el total de las ventas existentes que lo incluyen.

---

### Ventas

#### POST – Crear venta (requiere JWT)

```
POST http://localhost:3001/sales/create
```

Header requerido:

```
Authorization: Bearer <token>
```

Body:

```json
{
  "direccion": "Av. Colón 1450",
  "productos": [
    { "id": "z2", "qty": 2 },
    { "id": "z1", "qty": 1 }
  ]
}
```

El `id_usuario` se extrae del token JWT verificado, no del body.  
Valida stock disponible antes de confirmar la compra.  
Descuenta el stock de cada producto comprado.  
Si el stock llega a 0, el producto se marca automáticamente como no disponible.

---

#### POST – Ventas por usuario

```
POST http://localhost:3001/sales/user
```

Body:

```json
{
  "id_usuario": "6a2e1b95dfd18bf364a6651b"
}
```

Devuelve todas las ventas asociadas al usuario indicado.

---

#### GET – Detalle de venta

```
GET http://localhost:3001/sales/detail/:id
```

Devuelve el detalle completo de una venta: cliente, productos y total.

---

## Seguridad

- Las contraseñas se almacenan hasheadas con bcryptjs (salt rounds: 10). Nunca se guarda la contraseña en texto plano.
- El login genera un token JWT firmado con la clave del `.env`, con expiración de 8 horas.
- La ruta `POST /sales/create` está protegida por el middleware `verifyToken`, que valida el token del header `Authorization: Bearer <token>`.
- Si el token es inválido o expirado, el servidor devuelve 401.

---

## Seed

El archivo `seed.js` permite poblar la base de datos desde los archivos JSON de `data/`:

```
npm run seed
```

- Borra todas las colecciones existentes.
- Importa y hashea las contraseñas de los usuarios.
- Importa productos con stock inicial.
- Importa ventas mapeando los IDs numéricos a los ObjectId de MongoDB.

> El seed borra todos los datos existentes antes de importar.

---

## Autor

Tomás Cuevas

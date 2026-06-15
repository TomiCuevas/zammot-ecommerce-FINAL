const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, HeadingLevel,
  LevelFormat, ExternalHyperlink, PageNumber, Footer, PageBreak
} = require('docx')
const fs = require('fs')

// A4, márgenes normales
const PAGE_W = 11906
const PAGE_H = 16838
const MARGIN = 1080  // ~1.9cm (margen Word por defecto)
const CONTENT = PAGE_W - MARGIN * 2  // 9746 DXA

// Borde gris simple para tablas
const bd = { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" }
const bds = { top: bd, bottom: bd, left: bd, right: bd }

// Celda de encabezado de tabla (gris claro, negrita)
function hCell(text, w) {
  return new TableCell({
    borders: bds,
    width: { size: w, type: WidthType.DXA },
    shading: { fill: "EEEEEE", type: ShadingType.CLEAR },
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [new Paragraph({
      children: [new TextRun({ text, bold: true, size: 20, font: "Calibri" })]
    })]
  })
}

// Celda de datos normal
function dCell(text, w, bold = false) {
  return new TableCell({
    borders: bds,
    width: { size: w, type: WidthType.DXA },
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [new Paragraph({
      children: [new TextRun({ text, bold, size: 20, font: "Calibri" })]
    })]
  })
}

// Párrafo normal
function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, size: 22, font: "Calibri", ...opts })]
  })
}

// Párrafo en blanco
function sp() {
  return new Paragraph({ children: [new TextRun({ text: "", size: 22 })] })
}

// Título 1 — negro, subrayado
function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({
      text, bold: true, size: 28, font: "Calibri", underline: {}
    })]
  })
}

// Título 2 — negro, negrita
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 160, after: 80 },
    children: [new TextRun({ text, bold: true, size: 24, font: "Calibri" })]
  })
}

// Bullet simple
function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, size: 22, font: "Calibri" })]
  })
}

// Numerado
function numbered(text) {
  return new Paragraph({
    numbering: { reference: "numbers", level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, size: 22, font: "Calibri" })]
  })
}

// Bloque de código (monospace con fondo gris)
function code(text) {
  return new Paragraph({
    spacing: { after: 60 },
    shading: { fill: "F2F2F2", type: ShadingType.CLEAR },
    indent: { left: 360 },
    children: [new TextRun({ text, size: 18, font: "Courier New" })]
  })
}

// Link
function link(label, url) {
  return new ExternalHyperlink({
    link: url,
    children: [new TextRun({ text: label, size: 22, font: "Calibri", style: "Hyperlink" })]
  })
}

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "-",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 540, hanging: 270 } } }
        }]
      },
      {
        reference: "numbers",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 540, hanging: 270 } } }
        }]
      }
    ]
  },
  styles: {
    default: {
      document: { run: { font: "Calibri", size: 22 } }
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal",
        run: { size: 28, bold: true, font: "Calibri", color: "000000" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal",
        run: { size: 24, bold: true, font: "Calibri", color: "000000" },
        paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 1 }
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: PAGE_W, height: PAGE_H },
        margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN }
      }
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({ text: "Página ", size: 18, font: "Calibri", color: "888888" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 18, font: "Calibri", color: "888888" }),
            new TextRun({ text: " de ", size: 18, font: "Calibri", color: "888888" }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, font: "Calibri", color: "888888" }),
          ]
        })]
      })
    },
    children: [

      // ── PORTADA ──────────────────────────────────────────────────────────
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 1440, after: 240 },
        children: [new TextRun({ text: "ZAMMOT E-Commerce", bold: true, size: 40, font: "Calibri" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [new TextRun({ text: "Entrega Final — Aplicaciones Web II", size: 26, font: "Calibri" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [new TextRun({ text: "Tomás Cuevas · 2026", size: 22, font: "Calibri" })]
      }),
      new Paragraph({ children: [new PageBreak()] }),

      // ── 1. ENLACES ───────────────────────────────────────────────────────
      h1("1. Enlaces del Proyecto"),
      p("Repositorio de GitHub:", { bold: true }),
      new Paragraph({
        spacing: { after: 120 },
        children: [link("https://github.com/TomiCuevas/zammot-ecommerce-FINAL", "https://github.com/TomiCuevas/zammot-ecommerce-FINAL")]
      }),
      sp(),
      p("Video explicativo:", { bold: true }),
      new Paragraph({
        spacing: { after: 120 },
        children: [link("https://drive.google.com/file/d/1z0LAoiHLRPzSIe6MtmdqYPfI9zWsldD9/view?usp=sharing", "https://drive.google.com/file/d/1z0LAoiHLRPzSIe6MtmdqYPfI9zWsldD9/view?usp=sharing")]
      }),
      sp(),

      // ── 2. DESCRIPCIÓN ───────────────────────────────────────────────────
      h1("2. Descripción General del Sistema"),
      p("ZAMMOT es un e-commerce de indumentaria masculina formal construido sobre una arquitectura cliente-servidor desacoplada."),
      sp(),
      new Table({
        width: { size: CONTENT, type: WidthType.DXA },
        columnWidths: [2000, 2800, 4946],
        rows: [
          new TableRow({ children: [hCell("Capa", 2000), hCell("Tecnología", 2800), hCell("Descripción", 4946)] }),
          new TableRow({ children: [dCell("Frontend", 2000), dCell("HTML + CSS + JS Vanilla", 2800), dCell("Interfaz de usuario", 4946)] }),
          new TableRow({ children: [dCell("Backend", 2000), dCell("Node.js + Express", 2800), dCell("API REST", 4946)] }),
          new TableRow({ children: [dCell("Base de datos", 2000), dCell("MongoDB Atlas", 2800), dCell("Persistencia en la nube", 4946)] }),
        ]
      }),
      sp(),
      p("La comunicación sigue el patrón REST: Frontend → HTTP Request → Backend → MongoDB → JSON Response → Frontend."),
      sp(),

      // ── 3. ARQUITECTURA ──────────────────────────────────────────────────
      h1("3. Arquitectura en Capas (Backend)"),
      code("┌──────────────────────────────┐"),
      code("│       CLIENTE (Browser)      │"),
      code("└──────────────┬───────────────┘"),
      code("               │ HTTP Request"),
      code("┌──────────────▼───────────────┐"),
      code("│   RUTAS (routes/)            │  <- Define endpoints y middlewares"),
      code("└──────────────┬───────────────┘"),
      code("               │"),
      code("┌──────────────▼───────────────┐"),
      code("│   ACCIONES (actions/)        │  <- Lógica de negocio"),
      code("└──────────────┬───────────────┘"),
      code("               │"),
      code("┌──────────────▼───────────────┐"),
      code("│   DATOS (schemas/ + MongoDB) │  <- Modelos Mongoose"),
      code("└──────────────────────────────┘"),
      sp(),

      // ── 4. MODELOS DE DATOS ──────────────────────────────────────────────
      h1("4. Modelos de Datos (Mongoose Schemas)"),
      h2("Usuario"),
      new Table({
        width: { size: CONTENT, type: WidthType.DXA },
        columnWidths: [2200, 2000, 5546],
        rows: [
          new TableRow({ children: [hCell("Campo", 2200), hCell("Tipo", 2000), hCell("Detalle", 5546)] }),
          new TableRow({ children: [dCell("nombre, apellido", 2200), dCell("String", 2000), dCell("required", 5546)] }),
          new TableRow({ children: [dCell("email", 2200), dCell("String", 2000), dCell("required, unique", 5546)] }),
          new TableRow({ children: [dCell("password", 2200), dCell("String", 2000), dCell("hash bcrypt", 5546)] }),
          new TableRow({ children: [dCell("activo", 2200), dCell("Boolean", 2000), dCell("default: true", 5546)] }),
          new TableRow({ children: [dCell("direccion, fechaNac", 2200), dCell("String", 2000), dCell("opcionales", 5546)] }),
        ]
      }),
      sp(),
      h2("Producto"),
      p("Campos: id · title · price · category · stock · disponible"),
      sp(),
      h2("Venta"),
      p("Campos: id_usuario (ref) · productos[] · total · direccion · fecha"),
      sp(),

      // ── 5. ENDPOINTS ─────────────────────────────────────────────────────
      h1("5. Endpoints de la API REST"),
      p("Base URL: http://localhost:3001"),
      sp(),
      new Table({
        width: { size: CONTENT, type: WidthType.DXA },
        columnWidths: [1100, 3200, 4446, 1000],
        rows: [
          new TableRow({ children: [hCell("Método", 1100), hCell("Endpoint", 3200), hCell("Descripción", 4446), hCell("Auth", 1000)] }),
          new TableRow({ children: [dCell("POST", 1100), dCell("/users/create", 3200), dCell("Registrar usuario", 4446), dCell("—", 1000)] }),
          new TableRow({ children: [dCell("POST", 1100), dCell("/users/login", 3200), dCell("Login → devuelve JWT", 4446), dCell("—", 1000)] }),
          new TableRow({ children: [dCell("PUT", 1100), dCell("/users/update/:id", 3200), dCell("Actualizar datos del usuario", 4446), dCell("—", 1000)] }),
          new TableRow({ children: [dCell("DELETE", 1100), dCell("/users/delete/:id", 3200), dCell("Eliminar usuario + ventas", 4446), dCell("—", 1000)] }),
          new TableRow({ children: [dCell("GET", 1100), dCell("/products/", 3200), dCell("Todos los productos", 4446), dCell("—", 1000)] }),
          new TableRow({ children: [dCell("GET", 1100), dCell("/products/filter", 3200), dCell("Filtrar por precio/categoría", 4446), dCell("—", 1000)] }),
          new TableRow({ children: [dCell("PUT", 1100), dCell("/products/price/update/:id", 3200), dCell("Actualizar precio de producto", 4446), dCell("—", 1000)] }),
          new TableRow({ children: [dCell("POST", 1100), dCell("/sales/create", 3200), dCell("Crear venta", 4446), dCell("JWT", 1000)] }),
          new TableRow({ children: [dCell("GET", 1100), dCell("/sales/detail/:id", 3200), dCell("Detalle de venta", 4446), dCell("—", 1000)] }),
          new TableRow({ children: [dCell("POST", 1100), dCell("/sales/user", 3200), dCell("Historial de compras del usuario", 4446), dCell("—", 1000)] }),
        ]
      }),
      sp(),

      // ── 6. AUTENTICACIÓN ─────────────────────────────────────────────────
      h1("6. Sistema de Autenticación"),
      h2("Flujo de Registro"),
      code("Frontend  ->  POST /users/create  (password en texto plano)"),
      code("Backend   ->  bcrypt.hash(password, 10)   <- hash irreversible"),
      code("MongoDB   ->  guarda el hash (nunca la contraseña real)"),
      sp(),
      h2("Flujo de Login"),
      code("Frontend  ->  POST /users/login"),
      code("Backend   ->  bcrypt.compare(password, hash)"),
      code("Backend   ->  jwt.sign({ id, email }, SECRET, { expiresIn: '8h' })"),
      code("Frontend  ->  sessionStorage.setItem('token', token)"),
      sp(),
      h2("Flujo de Compra (ruta protegida)"),
      code("Frontend   ->  POST /sales/create + Authorization: Bearer <token>"),
      code("Middleware ->  verifyToken valida la firma del JWT"),
      code("Backend    ->  si 401: frontend limpia sesion y redirige al login"),
      sp(),

      // ── 7. CONTROL DE STOCK ──────────────────────────────────────────────
      h1("7. Control de Stock"),
      p("Al confirmar una compra (createSaleAction):"),
      numbered("Verifica que product.stock >= qty para cada producto"),
      numbered("Si no hay stock suficiente devuelve 400 INSUFFICIENT_STOCK"),
      numbered("Crea la venta en MongoDB"),
      numbered("Descuenta el stock con $inc: { stock: -qty }"),
      numbered("Si stock llega a 0 marca disponible: false"),
      sp(),
      p("Doble validación:", { bold: true }),
      bullet("Frontend: no permite agregar más unidades que el stock disponible"),
      bullet("Backend: rechaza la compra si el stock es insuficiente al momento de procesar"),
      sp(),

      // ── 8. ESTADO FRONTEND ───────────────────────────────────────────────
      h1("8. Gestión del Estado en el Frontend"),
      h2("sessionStorage (se borra al cerrar la pestaña)"),
      bullet("loggedUser — datos del usuario autenticado"),
      bullet("token — JWT activo"),
      bullet("loginMessage — mensaje entre redirecciones"),
      sp(),
      h2("localStorage (persiste entre sesiones)"),
      bullet("cart_<email> — carrito del usuario"),
      bullet("sales_<email> — historial local de compras"),
      bullet("zammot_wishlist_<email> — lista de favoritos"),
      sp(),

      // ── 9. TECNOLOGÍAS ───────────────────────────────────────────────────
      h1("9. Tecnologías y Dependencias"),
      h2("Backend"),
      new Table({
        width: { size: CONTENT, type: WidthType.DXA },
        columnWidths: [2200, 1400, 6146],
        rows: [
          new TableRow({ children: [hCell("Tecnología / Paquete", 2200), hCell("Versión", 1400), hCell("Función", 6146)] }),
          new TableRow({ children: [dCell("Node.js", 2200, true), dCell("v24.x", 1400), dCell("Entorno de ejecución JavaScript del servidor", 6146)] }),
          new TableRow({ children: [dCell("express", 2200), dCell("^5.2.1", 1400), dCell("Framework web, rutas y middlewares", 6146)] }),
          new TableRow({ children: [dCell("mongoose", 2200), dCell("^9.7.0", 1400), dCell("ODM para MongoDB, schemas y consultas", 6146)] }),
          new TableRow({ children: [dCell("bcryptjs", 2200), dCell("^3.0.3", 1400), dCell("Hash irreversible de contraseñas", 6146)] }),
          new TableRow({ children: [dCell("jsonwebtoken", 2200), dCell("^9.0.3", 1400), dCell("Generación y verificación de JWT", 6146)] }),
          new TableRow({ children: [dCell("dotenv", 2200), dCell("^17.4.2", 1400), dCell("Variables de entorno (.env)", 6146)] }),
          new TableRow({ children: [dCell("cors", 2200), dCell("^2.8.6", 1400), dCell("Comunicación entre puertos 5500 y 3001", 6146)] }),
        ]
      }),
      sp(),
      p("Configuración: \"type\": \"module\" → ES Modules (import/export)"),
      p("Scripts: npm start · npm run seed"),
      sp(),
      h2("Frontend (CDN)"),
      new Table({
        width: { size: CONTENT, type: WidthType.DXA },
        columnWidths: [3000, 1400, 5346],
        rows: [
          new TableRow({ children: [hCell("Librería", 3000), hCell("Versión", 1400), hCell("Uso", 5346)] }),
          new TableRow({ children: [dCell("Bootstrap CSS", 3000), dCell("5.3.2", 1400), dCell("Grilla, componentes, responsive", 5346)] }),
          new TableRow({ children: [dCell("Bootstrap JS", 3000), dCell("5.3.3", 1400), dCell("Menú hamburguesa, interactividad", 5346)] }),
          new TableRow({ children: [dCell("Bootstrap Icons", 3000), dCell("1.13.1", 1400), dCell("Iconos en navbar, productos, perfil", 5346)] }),
        ]
      }),
      sp(),
      h2("Herramientas de desarrollo"),
      bullet("MongoDB Atlas — base de datos NoSQL en la nube"),
      bullet("VS Code + Live Server — entorno de desarrollo (puerto 5500)"),
      bullet("Postman — pruebas de API REST"),
      bullet("Git + GitHub — control de versiones"),
      sp(),

      // ── 10. MEJORAS ──────────────────────────────────────────────────────
      h1("10. Mejoras Implementadas"),
      new Table({
        width: { size: CONTENT, type: WidthType.DXA },
        columnWidths: [700, 5500, 3546],
        rows: [
          new TableRow({ children: [hCell("#", 700), hCell("Mejora", 5500), hCell("Área", 3546)] }),
          new TableRow({ children: [dCell("01", 700), dCell("Autenticación JWT + bcryptjs", 5500), dCell("Backend + Frontend", 3546)] }),
          new TableRow({ children: [dCell("02", 700), dCell("Control de stock en tiempo real", 5500), dCell("Backend + Frontend", 3546)] }),
          new TableRow({ children: [dCell("03", 700), dCell("Domicilio estructurado en registro", 5500), dCell("Frontend + Backend", 3546)] }),
          new TableRow({ children: [dCell("04", 700), dCell("Página de perfil editable", 5500), dCell("Frontend + Backend", 3546)] }),
          new TableRow({ children: [dCell("05", 700), dCell("Buscador de productos por texto", 5500), dCell("Frontend", 3546)] }),
          new TableRow({ children: [dCell("06", 700), dCell("Redirección automática por token expirado", 5500), dCell("Frontend", 3546)] }),
          new TableRow({ children: [dCell("07", 700), dCell("Sistema de toasts (reemplaza alert())", 5500), dCell("Frontend", 3546)] }),
          new TableRow({ children: [dCell("08", 700), dCell("Estado activo en la navbar", 5500), dCell("Frontend", 3546)] }),
          new TableRow({ children: [dCell("09", 700), dCell("Validación mejorada en contacto", 5500), dCell("Frontend", 3546)] }),
          new TableRow({ children: [dCell("10", 700), dCell("Corrección warnings Mongoose deprecados", 5500), dCell("Backend", 3546)] }),
        ]
      }),
      sp(),
      h2("Detalle de las mejoras principales"),
      p("JWT + bcrypt: las contraseñas se hashean con bcrypt antes de guardarse. Cada compra requiere un token JWT válido de 8 horas."),
      sp(),
      p("Control de stock: validación en el frontend (no agrega más del stock disponible) y en el backend (rechaza si es insuficiente). El descuento es atómico con $inc y marca disponible: false al llegar a cero."),
      sp(),
      p("Perfil editable: PUT /users/update/:id actualiza tanto MongoDB como el sessionStorage simultáneamente, manteniendo la sesión consistente."),
      sp(),
      p("Token expirado: cuando el backend devuelve 401, el frontend limpia la sesión y redirige al login con un mensaje almacenado en sessionStorage."),
      sp(),
      p("Toasts: reemplazo de alert() por notificaciones animadas que se eliminan automáticamente a los 2.2 segundos."),

    ]
  }]
})

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('ENTREGA_FINAL.docx', buf)
  console.log('ENTREGA_FINAL.docx generado correctamente')
})

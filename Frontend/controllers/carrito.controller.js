document.addEventListener("DOMContentLoaded", () => {
    renderNavbar();

    const user = sessionStorage.getItem("loggedUser");

    if (!user) {
        window.location.href = "../index.html";
        return;
    }

    renderCart();
});

function verProducto(id) {
    const product = PRODUCTS_CACHE.find(p => p.id === id);
    const cart = loadCart();
    const item = cart.find(p => p.id === id);

    if (!product) return;

    const qty = item?.qty ?? 1;
    const subtotal = product.price * qty;

    document.getElementById("modalProductoTitulo").textContent = product.title;
    document.getElementById("modalProductoImg").src = product.img;
    document.getElementById("modalProductoImg").alt = product.title;
    document.getElementById("modalProductoDesc").textContent = product.description;
    document.getElementById("modalProductoPrecio").textContent = product.price;
    document.getElementById("modalProductoQty").textContent = qty;
    document.getElementById("modalProductoSubtotal").textContent = subtotal;

    const modal = new bootstrap.Modal(document.getElementById("modalProducto"));
    modal.show();
}

function renderCart() {
    const cart = loadCart();
    const container = document.getElementById("cart-items");

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center p-5 bg-secondary rounded-4 shadow-lg"
                 style="background: rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15);">
                
                <div class="mb-3">
                    <i class="bi bi-cart-x-fill" style="font-size: 4rem; color:#bbb;"></i>
                </div>

                <h4 class="text-light mb-2">Tu carrito está vacío</h4>
                <p class="text-secondary mb-4">
                    Agregá productos y aparecerán aquí
                </p>

                <a href="./destacados.html" 
                   class="btn btn-outline-light px-4 py-2 rounded-pill">
                    Ver productos destacados
                </a>
            </div>
        `;

        document.getElementById("cart-total").textContent = 0;
        return;
    }

    if (PRODUCTS_CACHE.length === 0) {
        loadProducts().then(renderCart);
        return;
    }

    let html = "";
    let total = 0;

    cart.forEach(item => {
        const product = PRODUCTS_CACHE.find(p => p.id === item.id);
        if (!product) return;

        let qty = Math.floor(Number(item.qty));
        if (!Number.isFinite(qty) || qty < 1) qty = 1;

        let price = Number(product.price);
        if (!Number.isFinite(price) || price < 0) price = 0;

        const subtotal = price * qty;
        total += subtotal;

        html += `
            <div class="card bg-secondary mb-3 p-3 shadow-sm">
                <div class="d-flex gap-4 align-items-center">

                    <img src="${product.img}" 
                         alt="${product.title}" 
                         class="rounded shadow"
                         style="width: 140px; height: 140px; object-fit: cover;">

                    <div class="flex-grow-1">
                        <h5 class="mb-1">${product.title}</h5>

                        <button class="btn btn-outline-info btn-sm mb-3"
                                onclick="verProducto('${product.id}')">
                            <i class="bi bi-eye"></i> Ver producto
                        </button>

                        <div class="d-flex align-items-center gap-3 my-2">
                            <button class="btn btn-sm btn-light" onclick="updateQty('${product.id}', -1)">−</button>
                            <span class="fs-5">${qty}</span>
                            <button class="btn btn-sm btn-light" onclick="updateQty('${product.id}', 1)">+</button>
                        </div>

                        <p class="m-0 text-white-50">Precio unitario: $${price}</p>
                        <h6 class="mt-1">Subtotal: $${subtotal}</h6>
                    </div>

                    <button class="btn btn-danger btn-sm"
                            onclick="removeFromCart('${product.id}')">
                        <i class="bi bi-trash"></i>
                    </button>

                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    document.getElementById("cart-total").textContent = total;
}

function vaciarCarrito() {
    showClearCartModal();
}
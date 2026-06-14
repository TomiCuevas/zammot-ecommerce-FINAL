// trae clave unica del carrito segun usuario logueado
function getCartKey() {
    const user = JSON.parse(sessionStorage.getItem("loggedUser"));
    if (!user) return null;
    return "cart_" + user.email; // un carrito por usuario
}

function loadCart() {
    const key = getCartKey();
    if (!key) return [];

    const stored = JSON.parse(localStorage.getItem(key)) || [];

    return stored.map(item => {
        let qty = Math.floor(Number(item.qty));
        if (!Number.isFinite(qty) || qty < 1) qty = 1;
        return { id: item.id, qty };
    });
}

function saveCart(cart) {
    const key = getCartKey();
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(cart));
}

function clearCart() {
    saveCart([]);
    updateCartCount();
}

// HISTORIAL LOCAL PARA MOSTRAR EN MIS COMPRAS
function getSalesKey() {
    const user = JSON.parse(sessionStorage.getItem("loggedUser"));
    if (!user) return null;
    return "sales_" + user.email;
}

function loadSales() {
    const key = getSalesKey();
    if (!key) return [];
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveSales(sales) {
    const key = getSalesKey();
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(sales));
}

// COMPRA REAL CON BACKEND
async function completePurchase() {
    const user = JSON.parse(sessionStorage.getItem("loggedUser"));

    if (!user) {
        showCartLoginModal();
        return;
    }

    const cart = loadCart();

    if (!cart.length) {
        showErrorPurchaseToast("Tu carrito está vacío.");
        return;
    }

    try {
        const saleData = {
            id_usuario: user.id,
            direccion: user.direccion || "Dirección pendiente",
            productos: cart.map(item => ({
                id: item.id,
                qty: item.qty
            }))
        };

        const result = await createSaleApi(saleData);

        const saleForLocalHistory = {
            ...result.sale,
            detalles: cart
        };

        const sales = loadSales();
        sales.unshift(saleForLocalHistory);
        saveSales(sales);

        clearCart();

        if (typeof renderCart === "function") renderCart();

        showPurchaseSuccess();

    } catch (error) {
        if (error.message === "TOKEN_EXPIRED") {
            sessionStorage.setItem("loginMessage", "Tu sesión expiró. Iniciá sesión nuevamente.");
            sessionStorage.removeItem("loggedUser");
            sessionStorage.removeItem("token");
            localStorage.removeItem("isLoggedIn");
            window.location.href = "../index.html";
            return;
        }
        showErrorPurchaseToast(error.message || "No se pudo completar la compra.");
    }
}

window.completePurchase = completePurchase;
window.loadSales = loadSales;

// compra exitosa
function showPurchaseSuccess() {
    const existing = document.getElementById("purchaseSuccessModal");
    if (existing) existing.remove();

    const modal = document.createElement("div");
    modal.id = "purchaseSuccessModal";

    modal.style = `
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.70);
        backdrop-filter: blur(6px);
        display: flex; justify-content: center; align-items: center;
        z-index: 999999;
    `;

    modal.innerHTML = `
        <div style="
            background: rgba(20,20,20,0.92);
            border: 1px solid rgba(255,255,255,0.12);
            padding: 30px;
            border-radius: 18px;
            width: 90%; max-width: 380px;
            text-align: center; color: white;
            animation: fadeInSuccess .3s ease-out;
        ">
            <i class="bi bi-bag-check-fill" style="font-size: 55px; color:#28db5f;"></i>

            <h3 class="mt-3 mb-2">¡Compra exitosa!</h3>

            <p class="text-white-50 mb-4">
                Gracias por tu compra.
                Tu pedido fue registrado correctamente en el servidor.
            </p>

            <button onclick="document.getElementById('purchaseSuccessModal').remove()"
                style="
                    width: 100%; padding: 12px;
                    border: none; border-radius: 10px;
                    background: #0d6efd; color: white;
                    font-weight: 600;
                ">
                Aceptar
            </button>
        </div>

        <style>
            @keyframes fadeInSuccess {
                from { opacity: 0; transform: scale(.92); }
                to   { opacity: 1; transform: scale(1); }
            }
        </style>
    `;

    document.body.appendChild(modal);
}

function showErrorPurchaseToast(msg) {
    const existing = document.getElementById("purchaseErrorToast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "purchaseErrorToast";
    toast.style = `
        position: fixed;
        bottom: 25px;
        right: 25px;
        background: rgba(30,30,30,0.92);
        color: white;
        padding: 14px 20px;
        border-radius: 10px;
        font-size: 15px;
        box-shadow: 0 4px 18px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 999999;
        animation: fadeInToast .3s ease-out;
    `;

    toast.innerHTML = `
        <i class="bi bi-exclamation-circle-fill" style="color:#ff4444; font-size: 18px;"></i>
        <span>${msg}</span>

        <style>
            @keyframes fadeInToast {
                from { opacity: 0; transform: translateY(10px); }
                to   { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeOutToast {
                from { opacity: 1; transform: translateY(0); }
                to   { opacity: 0; transform: translateY(10px); }
            }
        </style>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = "fadeOutToast .4s ease-in forwards";
        setTimeout(() => toast.remove(), 400);
    }, 2200);
}

function addToCart(productId, qty = 1) {
    const user = JSON.parse(sessionStorage.getItem("loggedUser"));

    if (!user) {
        showCartLoginModal();
        return;
    }

    qty = Math.floor(Number(qty));
    if (!Number.isFinite(qty) || qty < 1) qty = 1;

    let cart = loadCart();
    const item = cart.find(p => p.id === productId);

    if (item) {
        let currentQty = Math.floor(Number(item.qty));
        if (!Number.isFinite(currentQty) || currentQty < 1) currentQty = 1;
        item.qty = currentQty + qty;
    } else {
        cart.push({ id: productId, qty });
    }

    saveCart(cart);
    updateCartCount();
    showAddedToast();
}

function removeFromCart(productId) {
    let cart = loadCart();
    cart = cart.filter(item => item.id !== productId);

    saveCart(cart);
    updateCartCount();

    if (typeof renderCart === "function") renderCart();
}

function updateQty(productId, change) {
    let cart = loadCart();
    const item = cart.find(p => p.id === productId);
    if (!item) return;

    let qty = Math.floor(Number(item.qty)) + change;
    if (qty < 1) qty = 1;

    item.qty = qty;

    saveCart(cart);
    updateCartCount();

    if (typeof renderCart === "function") renderCart();
}

function updateCartCount() {
    const cart = loadCart();
    let total = 0;

    cart.forEach(item => {
        let qty = Math.floor(Number(item.qty));
        if (!Number.isFinite(qty) || qty < 1) qty = 1;
        total += qty;
    });

    const badge = document.getElementById("cart-count");
    if (badge) badge.textContent = total;
}

window.updateCartCount = updateCartCount;

// adaptacion a celus
function openProductModal(product, cartItemQty) {
    const modalBody = document.getElementById("modal-body");
    const modalTitle = document.getElementById("modal-title");

    if (!modalBody || !modalTitle) return;

    modalTitle.textContent = product.title;

    modalBody.innerHTML = `
        <div class="container-fluid">
            <div class="row align-items-center">

                <div class="col-12 col-md-6 mb-3">
                    <img src="${product.img}" class="img-fluid rounded shadow-sm w-100" alt="${product.title}">
                </div>

                <div class="col-12 col-md-6">
                    <p>${product.description}</p>
                    <p><strong>Precio:</strong> $${product.price}</p>
                    <p><strong>Cantidad:</strong> ${cartItemQty}</p>
                    <p><strong>Subtotal:</strong> $${product.price * cartItemQty}</p>
                </div>

            </div>
        </div>
    `;
}

// esto es para los intrusos... tienen que loguearse
function showCartLoginModal() {
    const modal = document.createElement("div");

    modal.id = "cartLoginModal";
    modal.style = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.65); backdrop-filter: blur(6px);
        display: flex; justify-content: center; align-items: center;
        z-index: 999999;
    `;

    modal.innerHTML = `
        <div style="
            background: rgba(20,20,20,0.85);
            border: 1px solid rgba(255,255,255,0.1);
            padding: 25px; border-radius: 16px;
            width: 90%; max-width: 360px;
            color: white; text-align: center;
            animation: fadeInCart .25s ease-out;
        ">
            <h4 class="mb-3">Inicia sesión para continuar</h4>

            <p class="text-white-50 mb-4">
                Para agregar productos al carrito debes iniciar sesión.
            </p>

            <button onclick="window.location.href='../index.html'"
                style="
                    width: 100%; padding: 12px;
                    border: none; border-radius: 10px;
                    background: #0d6efd; color: white;
                    font-weight: 600; margin-bottom: 10px;
                ">
                Iniciar sesión
            </button>

            <button onclick="document.getElementById('cartLoginModal').remove()"
                style="
                    width: 100%; padding: 10px;
                    border: none; border-radius: 10px;
                    background: #6c757d; color: white;
                    font-weight: 500;
                ">
                Cancelar
            </button>
        </div>

        <style>
        @keyframes fadeInCart {
            from { opacity: 0; transform: scale(.95); }
            to   { opacity: 1; transform: scale(1); }
        }
        </style>
    `;

    document.body.appendChild(modal);
}

// confirmar si vaciamos carrito
function showClearCartModal() {
    const existing = document.getElementById("clearCartModal");
    if (existing) existing.remove();

    const modal = document.createElement("div");
    modal.id = "clearCartModal";

    modal.style = `
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.65);
        backdrop-filter: blur(6px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999999;
    `;

    modal.innerHTML = `
        <div style="
            background: rgba(20,20,20,0.90);
            border: 1px solid rgba(255,255,255,0.12);
            padding: 25px;
            border-radius: 16px;
            width: 90%; max-width: 360px;
            color: white;
            text-align: center;
            animation: fadeInClear .25s ease-out;
        ">
            <h4 class="mb-3">Vaciar carrito</h4>

            <p class="text-white-50 mb-4">
                ¿Estás seguro de que querés vaciar todo el carrito?<br>
                <small>(No podrás deshacer esta acción)</small>
            </p>

            <button onclick="confirmClearCart()"
                style="
                    width: 100%; padding: 12px;
                    border: none; border-radius: 10px;
                    background: #dc3545;
                    color: white; font-weight: 600;
                    margin-bottom: 10px;
                ">
                Vaciar carrito
            </button>

            <button onclick="document.getElementById('clearCartModal').remove()"
                style="
                    width: 100%; padding: 10px;
                    border: none; border-radius: 10px;
                    background: #6c757d;
                    color: white; font-weight: 500;
                ">
                Cancelar
            </button>
        </div>

        <style>
            @keyframes fadeInClear {
                from { opacity: 0; transform: scale(.95); }
                to   { opacity: 1; transform: scale(1); }
            }
        </style>
    `;

    document.body.appendChild(modal);
}

function confirmClearCart() {
    clearCart();

    const modal = document.getElementById("clearCartModal");
    if (modal) modal.remove();

    if (typeof renderCart === "function") renderCart();
}

// aviso de producto agregado
function showAddedToast() {
    const existing = document.getElementById("toastAdded");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "toastAdded";
    toast.style = `
        position: fixed;
        bottom: 25px;
        right: 25px;
        background: rgba(30,30,30,0.90);
        color: white;
        padding: 14px 20px;
        border-radius: 10px;
        font-size: 15px;
        box-shadow: 0 4px 18px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 999999;
        animation: fadeInToast .3s ease-out;
    `;

    toast.innerHTML = `
        <i class="bi bi-check-circle-fill" style="color:#28db5f; font-size: 18px;"></i>
        <span>Producto agregado con éxito</span>

        <style>
            @keyframes fadeInToast {
                from { opacity: 0; transform: translateY(10px); }
                to   { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeOutToast {
                from { opacity: 1; transform: translateY(0); }
                to   { opacity: 0; transform: translateY(10px); }
            }
        </style>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = "fadeOutToast .4s ease-in forwards";
        setTimeout(() => toast.remove(), 400);
    }, 2200);
}
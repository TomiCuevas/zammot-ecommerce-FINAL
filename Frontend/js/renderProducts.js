let PRODUCTS_CACHE = [];

async function loadProducts(category = null) {

    try {

        let data = [];

        if (category) {

            data = await getProductsByCategory(category);

        } else {

            data = await getAllProducts();

        }

        PRODUCTS_CACHE = data;

        return data;

    } catch (error) {

        console.error("ERROR cargando productos:", error);

        return [];

    }

}

async function renderProducts(category) {

    const container = document.getElementById("product-list");

    if (!container) {
        console.error("No existe #product-list");
        return;
    }

    const products = await loadProducts(category);

    if (!products.length) {

        container.innerHTML = `
            <p class="text-center">
                No hay productos disponibles.
            </p>
        `;

        return;
    }

    container.innerHTML = products
        .map(renderProductCard)
        .join("");

    products.forEach(product => {

        if (typeof updateWishlistIcon === "function") {
            updateWishlistIcon(product.id);
        }

    });

}

function renderProductCard(product) {

    return `
    <div class="card m-3 shadow d-flex flex-column h-100 product-card" data-card-id="${product.id}" style="width: 18rem;">

        <img src="${product.img}" class="product-img" alt="${product.title}">

        <div class="card-body d-flex flex-column">

            <h5 class="card-title d-flex justify-content-between align-items-center">

                ${product.title}

                <button
                    class="btn btn-light btn-sm"
                    data-fav-id="${product.id}"
                    onclick="toggleFavorite('${product.id}')">

                    <i class="bi bi-heart"></i>

                </button>

            </h5>

            ${product.disponible === false
                ? `<span class="badge bg-danger mb-2">Sin stock</span>`
                : ``
            }

            <p class="card-text flex-grow-1">
                ${product.description}
            </p>

            <h6 class="fw-bold">
                $${product.price}
            </h6>

            <div class="d-flex align-items-center mt-3 qty-box">

                <button
                    class="qty-btn"
                    onclick="changeQty(this, -1)">
                    -
                </button>

                <span class="mx-2 qty-value">
                    1
                </span>

                <button
                    class="qty-btn"
                    onclick="changeQty(this, 1)">
                    +
                </button>

            </div>

            ${product.disponible !== false
                ? `
                    <button
                        class="btn btn-primary w-100 mt-auto"
                        onclick="addProductToCart(this, '${product.id}')">

                        <i class="bi bi-cart-plus"></i>
                        Agregar al carrito

                    </button>
                `
                : `
                    <button
                        class="btn btn-secondary w-100 mt-auto"
                        disabled>

                        Sin stock

                    </button>
                `
            }

        </div>

    </div>
    `;
}

function changeQty(button, amount) {

    const card = button.closest(".product-card");

    if (!card) return;

    const qtySpan = card.querySelector(".qty-value");

    if (!qtySpan) return;

    const productId = card.dataset.cardId;
    const product = PRODUCTS_CACHE.find(p => p.id === productId);
    const maxStock = product ? product.stock : 99;

    let qty = parseInt(qtySpan.textContent) || 1;

    qty += amount;

    if (qty < 1) qty = 1;
    if (qty > maxStock) qty = maxStock;

    qtySpan.textContent = qty;

}

function addProductToCart(button, id) {

    const product = PRODUCTS_CACHE.find(p => p.id === id);

    if (!product) {
        console.error("Producto no encontrado");
        return;
    }

    if (product.disponible === false) {
        return;
    }

    const card = button.closest(".product-card");

    const qtySpan = card
        ? card.querySelector(".qty-value")
        : null;

    const qty = qtySpan
        ? parseInt(qtySpan.textContent) || 1
        : 1;

    if (qty > product.stock) {
        if (typeof showErrorToast === "function") {
            showErrorToast(`Solo hay ${product.stock} unidad${product.stock !== 1 ? 'es' : ''} disponible${product.stock !== 1 ? 's' : ''}.`);
        }
        return;
    }

    if (typeof window.addToCart === "function") {

        window.addToCart(id, qty);

    } else {

        console.error("No existe addToCart()");

    }

}
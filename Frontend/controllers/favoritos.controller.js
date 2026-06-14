document.addEventListener("DOMContentLoaded", () => {

    renderNavbar();

    updateWishlistCount();

    renderFavorites();

});

function renderFavorites() {

    const list = loadWishlist();

    const container = document.getElementById("fav-list");

    if (!container) return;

    if (list.length === 0) {

        showEmptyFavorites(container);

        return;

    }

    loadProducts().then(() => {

        const favorites = PRODUCTS_CACHE.filter(product =>
            list.includes(product.id)
        );

        if (favorites.length === 0) {

            showEmptyFavorites(container);

            return;

        }

        container.innerHTML = favorites.map(product => `
            <div class="col-md-4 d-flex justify-content-center" id="card-${product.id}">
                ${renderProductCard(product)}
            </div>
        `).join("");

        favorites.forEach(product => updateWishlistIcon(product.id));

    });

}

function showEmptyFavorites(container) {

    container.innerHTML = `
        <div class="d-flex justify-content-center mt-5">
            <div class="p-5 rounded shadow-lg text-center"
                 style="
                    background: rgba(255,255,255,0.08); 
                    backdrop-filter: blur(6px); 
                    max-width: 500px;
                    animation: fadeIn .6s ease;
                 ">

                <div class="mb-3">
                    <i class="bi bi-heartbreak-fill" style="font-size: 4rem; color: #dc3545;"></i>
                </div>

                <h3 class="fw-bold mb-3">Todavía no agregaste favoritos</h3>

                <p class="text-white-50 mb-4">
                    Cuando marques un producto con ❤️ aparecerá acá para verlo más tarde.
                </p>

                <a href="../pages/home.html" class="btn btn-primary px-4 py-2">
                    <i class="bi bi-shop"></i> Ir a comprar
                </a>
            </div>
        </div>

        <style>
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        </style>
    `;

}
// obtener email del logueado
function getUserEmail() {
    const user = sessionStorage.getItem("loggedUser");
    if (!user) return null;
    return JSON.parse(user).email;
}

// clave única de cada usuario
function getWishlistKey() {
    const email = getUserEmail();
    if (!email) return null;
    return `zammot_wishlist_${email}`;
}

function loadWishlist() {
    const KEY = getWishlistKey();
    if (!KEY) return [];

    const list = JSON.parse(localStorage.getItem(KEY));

    if (!Array.isArray(list)) return [];

    return list;
}

function saveWishlist(list) {
    const KEY = getWishlistKey();
    if (!KEY) return;
    localStorage.setItem(KEY, JSON.stringify(list));
}

// cartel para usuario no logueado
function showLoginRequiredModal() {
    const modal = document.createElement("div");

    modal.id = "wishlistLoginModal";
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
            animation: fadeInWishlist .25s ease-out;
        ">
            <h4 class="mb-3">Inicia sesión para continuar</h4>

            <p class="text-white-50 mb-4">
                Para agregar productos a favoritos debes iniciar sesión.
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

            <button onclick="document.getElementById('wishlistLoginModal').remove()"
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
            @keyframes fadeInWishlist {
                from { opacity: 0; transform: scale(.95); }
                to { opacity: 1; transform: scale(1); }
            }
        </style>
    `;

    document.body.appendChild(modal);
}

// agregar y sacar favorito
function toggleFavorite(productId) {
    if (localStorage.getItem("isLoggedIn") !== "true") {
        showLoginRequiredModal();
        return;
    }

    let list = loadWishlist();

    if (list.includes(productId)) {
        list = list.filter(id => id !== productId);
        saveWishlist(list);
        removeFavoriteCard(productId, list);
    } else {
        list.push(productId);
        saveWishlist(list);
    }

    updateWishlistIcon(productId);
    updateWishlistCount();
}

function isFavorite(productId) {
    let list = loadWishlist();
    if (!Array.isArray(list)) return false;
    return list.includes(productId);
}

function updateWishlistIcon(productId) {
    const buttons = document.querySelectorAll(
        `[data-fav-id="${productId}"]`
    );

    if (!buttons.length) return;

    buttons.forEach(btn => {
        if (isFavorite(productId)) {
            btn.innerHTML = `
                <i class="bi bi-heart-fill" style="color:#dc3545;"></i>
            `;
        } else {
            btn.innerHTML = `
                <i class="bi bi-heart"></i>
            `;
        }
    });
}

// contador de favoritos en navbar evitando errores NaN
function updateWishlistCount() {
    const counter = document.getElementById("wishlist-count");
    if (!counter) return;

    let list = loadWishlist();
    if (!Array.isArray(list)) list = [];

    counter.textContent = list.length;
}

function removeFavoriteCard(productId, updatedList) {
    const cards = document.querySelectorAll(
        `[data-card-id="${productId}"]`
    );

    cards.forEach(card => {
        card.style.transition = "opacity .4s ease";
        card.style.opacity = "0";
        setTimeout(() => card.remove(), 400);
    });

    if (updatedList.length === 0) {
        const container = document.getElementById("fav-list");

        if (
            container &&
            typeof showEmptyFavorites === "function"
        ) {
            showEmptyFavorites(container);
        }
    }
}
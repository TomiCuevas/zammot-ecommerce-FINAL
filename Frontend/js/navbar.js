function renderNavbar() { 
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));

    let nav = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-4">
        <a class="navbar-brand d-flex align-items-center" href="../pages/home.html">
            <img src="../styles/img/zammot_bowtie.webp" height="40" class="me-2"> 
            ZAMMOT
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
    `;

    // navbar para el intruso
    if (!isLoggedIn || !loggedUser) {
        nav += `
            <li class="nav-item">
                <a class="nav-link" href="../pages/home.html">Home</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="../pages/Registro.html">Registrarse</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="../pages/contacto.html">Contacto</a>
            </li>

            <!-- Botón iniciar sesión -->
            <li class="nav-item">
                <a class="nav-link d-flex align-items-center gap-1" href="../index.html">
                    <i class="bi bi-box-arrow-in-right"></i>
                </a>
            </li>
        `;
    }

    // navbar para usuario logueado
    else {
        const nombreMostrar = loggedUser.nombre?.split(" ")[0] || "Usuario";

        nav += `
            <li class="nav-item d-flex align-items-center me-3">
                <a href="./perfil.html" class="text-white text-decoration-none fw-light">
                    Hola, <span class="fw-bold ms-1">${nombreMostrar}</span>
                </a>
            </li>
        `;

        const currentPage = window.location.pathname.split('/').pop();

        pages.forEach(p => {
            const icono = p.title === "Mis compras"
                ? `<i class="bi bi-bag-check me-1"></i>`
                : "";

            const isActive = currentPage === p.url.replace('./', '') ? 'nav-active' : '';

            nav += `
                <li class="nav-item">
                    <a class="nav-link d-flex align-items-center ${isActive}" href="${p.url}">
                        ${icono}${p.title}
                    </a>
                </li>
            `;
        });

        // favoritos
        nav += `
            <li class="nav-item">
                <a class="nav-link d-flex align-items-center gap-1" href="../pages/favoritos.html">
                    <i class="bi bi-heart-fill"></i>
                    <span id="wishlist-count" class="badge bg-danger rounded-pill">0</span>
                </a>
            </li>
        `;

        // carrito
        nav += `
            <li class="nav-item">
                <a class="nav-link d-flex align-items-center gap-1" href="../pages/carrito.html">
                    <i class="bi bi-cart3"></i>
                    <span id="cart-count" class="badge bg-primary rounded-pill">0</span>
                </a>
            </li>
        `;

        // logout
        nav += `
            <li class="nav-item">
                <a class="nav-link text-danger fw-bold d-flex align-items-center gap-1"
                   href="#" onclick="logoutUser()">
                    <i class="bi bi-box-arrow-right"></i>
                </a>
            </li>
        `;
    }

    nav += `
            </ul>
        </div>
    </nav>
    `;

    document.getElementById("navbar").innerHTML = nav;

    setTimeout(() => {
        if (loggedUser && typeof updateCartCount === "function") {
            updateCartCount();
        }
        if (typeof updateWishlistCount === "function") {
            updateWishlistCount();
        }
    }, 0);
}
document.addEventListener("DOMContentLoaded", async () => {

    renderNavbar();

    await renderProducts();

    initializeFilters();

});

function initializeFilters() {

    const categoryFilter  = document.getElementById("category-filter");
    const minPriceFilter  = document.getElementById("min-price-filter");
    const maxPriceFilter  = document.getElementById("max-price-filter");
    const sortFilter      = document.getElementById("sort-filter");
    const searchFilter    = document.getElementById("search-filter");
    const clearFiltersBtn = document.getElementById("clear-filters");

    if (!categoryFilter) return;

    let debounceTimer = null;

    const debouncedApply = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(applyFilters, 500);
    };

    categoryFilter.addEventListener("change", applyFilters);
    sortFilter.addEventListener("change", applyFilters);
    minPriceFilter.addEventListener("input", debouncedApply);
    maxPriceFilter.addEventListener("input", debouncedApply);

    if (searchFilter) {
        searchFilter.addEventListener("input", debouncedApply);
    }

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener("click", async () => {
            categoryFilter.value  = "all";
            minPriceFilter.value  = "";
            maxPriceFilter.value  = "";
            sortFilter.value      = "";
            if (searchFilter) searchFilter.value = "";
            await renderProducts();
        });
    }

}

async function applyFilters() {

    const category   = document.getElementById("category-filter").value;
    const minPrice   = document.getElementById("min-price-filter").value;
    const maxPrice   = document.getElementById("max-price-filter").value;
    const sortBy     = document.getElementById("sort-filter").value;
    const searchText = (document.getElementById("search-filter")?.value || "").trim().toLowerCase();

    try {

        let products = await getFilteredProducts({ category, minPrice, maxPrice, sortBy });

        if (searchText) {
            products = products.filter(p =>
                p.title.toLowerCase().includes(searchText)
            );
        }

        PRODUCTS_CACHE = products;

        renderFilteredProducts(products);

    } catch (error) {

        const container = document.getElementById("product-list");

        if (container) {
            container.innerHTML = `
                <p class="text-center text-danger">
                    No se pudieron aplicar los filtros.
                </p>
            `;
        }

    }

}

function renderFilteredProducts(products) {

    const container = document.getElementById("product-list");

    if (!container) return;

    if (!products.length) {

        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-search fs-1 text-secondary"></i>
                <p class="mt-3 text-secondary">
                    No hay productos con esos filtros.
                </p>
            </div>
        `;

        return;

    }

    container.innerHTML = products.map(renderProductCard).join("");

    products.forEach(product => {
        if (typeof updateWishlistIcon === "function") {
            updateWishlistIcon(product.id);
        }
    });

}

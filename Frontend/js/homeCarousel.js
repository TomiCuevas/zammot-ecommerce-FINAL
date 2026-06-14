document.addEventListener("DOMContentLoaded", async () => {

    await loadProducts("destacados");

    buildHorizontalCarousel();

});

function buildHorizontalCarousel() {

    const track = document.querySelector(".horizontal-track");

    if (!track) {
        console.error("No existe .horizontal-track");
        return;
    }

    const destacados = PRODUCTS_CACHE;

    if (!destacados.length) {
        track.innerHTML = `<p class="text-center">No hay productos destacados.</p>`;
        return;
    }

    track.innerHTML = destacados
        .map(product => `
            <div class="me-4">
                ${renderProductCard(product)}
            </div>
        `)
        .join("");

    destacados.forEach(product => {

        if (typeof updateWishlistIcon === "function") {
            updateWishlistIcon(product.id);
        }

    });

    const btnLeft = document.querySelector(".left-btn");
    const btnRight = document.querySelector(".right-btn");

    if (btnLeft) {
        btnLeft.onclick = () => {
            track.scrollBy({
                left: -300,
                behavior: "smooth"
            });
        };
    }

    if (btnRight) {
        btnRight.onclick = () => {
            track.scrollBy({
                left: 300,
                behavior: "smooth"
            });
        };
    }

}
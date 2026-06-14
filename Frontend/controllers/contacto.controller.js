document.addEventListener("DOMContentLoaded", () => {

    renderNavbar();

    const form = document.getElementById("contacto-form");

    if (form) {

        form.addEventListener("submit", (event) => {

            event.preventDefault();

            const nombre  = document.getElementById("contacto-nombre")?.value.trim();
            const email   = document.getElementById("contacto-email")?.value.trim();
            const mensaje = document.getElementById("contacto-mensaje")?.value.trim();

            if (!nombre || !email || !mensaje) {
                showErrorToast("Completá todos los campos antes de enviar.");
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showErrorToast("Ingresá un email válido.");
                return;
            }

            showSuccessToast("Mensaje enviado correctamente.");
            form.reset();

        });

    }

});
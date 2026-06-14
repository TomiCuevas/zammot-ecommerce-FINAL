document.addEventListener("DOMContentLoaded", () => {

    const emailInput = document.getElementById("email");

    if (emailInput) {

        emailInput.addEventListener("input", () => {

            emailInput.value = emailInput.value.toLowerCase();

        });

    }

    const loginMessage = sessionStorage.getItem("loginMessage");

    if (loginMessage) {
        sessionStorage.removeItem("loginMessage");
        if (typeof showErrorToast === "function") {
            showErrorToast(loginMessage);
        }
    }

});

// Mostrar/Ocultar botón oculto
document.addEventListener("keydown", function(e) {

    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "l") {

        const btn = document.getElementById("debug-clear-storage");

        btn.style.display =
            btn.style.display === "none"
                ? "block"
                : "none";

    }

});

function clearAllStorage() {

    if (confirm("¿Seguro que deseas borrar TODO el localStorage?")) {

        localStorage.clear();

        alert("Se borró TODO el localStorage correctamente.");

    }

}
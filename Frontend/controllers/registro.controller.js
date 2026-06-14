document.addEventListener("DOMContentLoaded", () => {
    const emailInput = document.getElementById("reg-email");

    if (emailInput) {
        emailInput.addEventListener("input", () => {
            emailInput.value = emailInput.value.toLowerCase();
        });
    }
});
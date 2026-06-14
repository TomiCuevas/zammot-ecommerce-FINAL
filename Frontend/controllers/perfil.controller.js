document.addEventListener("DOMContentLoaded", () => {

    renderNavbar();

    const user = JSON.parse(sessionStorage.getItem("loggedUser"));

    if (!user) {
        window.location.href = "../index.html";
        return;
    }

    document.getElementById("perfil-nombre").value   = user.nombre   || "";
    document.getElementById("perfil-apellido").value = user.apellido || "";
    document.getElementById("perfil-email").value    = user.email    || "";

    // Pre-rellenar dirección existente parseando el formato combinado
    // Formato guardado: "Calle Nro [Piso], Localidad, Provincia, CP XXXXX"
    const dir = user.direccion || "";
    const partes = dir.split(",").map(p => p.trim());

    if (partes.length >= 4) {
        // Primer segmento: "Calle Nro" o "Calle Nro Piso"
        const calleNroPiso = partes[0].split(" ");
        const posibleNro   = calleNroPiso.find(p => /^\d/.test(p));
        const idxNro       = posibleNro ? calleNroPiso.indexOf(posibleNro) : -1;

        if (idxNro > 0) {
            document.getElementById("perfil-calle").value  = calleNroPiso.slice(0, idxNro).join(" ");
            document.getElementById("perfil-numero").value = calleNroPiso[idxNro];
            const resto = calleNroPiso.slice(idxNro + 1).join(" ");
            if (resto) document.getElementById("perfil-piso").value = resto;
        } else {
            document.getElementById("perfil-calle").value = partes[0];
        }

        document.getElementById("perfil-localidad").value = partes[1] || "";
        document.getElementById("perfil-provincia").value = partes[2] || "";
        const cpRaw = (partes[3] || "").replace(/^CP\s*/i, "");
        document.getElementById("perfil-cp").value = cpRaw;

    } else if (dir) {
        // Formato libre (registros viejos): poner todo en calle como fallback
        document.getElementById("perfil-calle").value = dir;
    }

    const form = document.getElementById("perfil-form");

    if (form) {
        form.addEventListener("submit", async (event) => {

            event.preventDefault();

            const nombre    = document.getElementById("perfil-nombre").value.trim();
            const apellido  = document.getElementById("perfil-apellido").value.trim();
            const calle     = document.getElementById("perfil-calle").value.trim();
            const numero    = document.getElementById("perfil-numero").value.trim();
            const piso      = document.getElementById("perfil-piso").value.trim();
            const localidad = document.getElementById("perfil-localidad").value.trim();
            const provincia = document.getElementById("perfil-provincia").value.trim();
            const cp        = document.getElementById("perfil-cp").value.trim();

            if (!nombre || !apellido) {
                showErrorToast("Nombre y apellido son obligatorios.");
                return;
            }

            if (!calle || !numero || !localidad || !provincia || !cp) {
                showErrorToast("Completá todos los campos del domicilio.");
                return;
            }

            const pisoStr  = piso ? ` ${piso}` : "";
            const direccion = `${calle} ${numero}${pisoStr}, ${localidad}, ${provincia}, CP ${cp}`;

            try {

                await updateUserApi(user.id, { nombre, apellido, direccion });

                const updatedUser = { ...user, nombre, apellido, direccion };
                sessionStorage.setItem("loggedUser", JSON.stringify(updatedUser));

                showSuccessToast("Datos actualizados correctamente.");
                renderNavbar();

            } catch (error) {

                showErrorToast(error.message || "Error al actualizar los datos.");

            }

        });
    }

});

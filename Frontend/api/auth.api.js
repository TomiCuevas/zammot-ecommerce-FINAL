import { BASE_URL } from "./app.js";

const API_URL = `${BASE_URL}/users`;

async function loginApi(email, password) {

    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.message || "Error al iniciar sesión"
        );

    }

    return data;

}

async function createUserApi(userData) {

    const response = await fetch(`${API_URL}/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.message || "Error al crear usuario"
        );

    }

    return data;

}

async function updateUserApi(id, userData) {

    const response = await fetch(`${API_URL}/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error al actualizar usuario");
    }

    return data;

}

window.loginApi = loginApi;
window.createUserApi = createUserApi;
window.updateUserApi = updateUserApi;

export {
    loginApi,
    createUserApi,
    updateUserApi
};
import { BASE_URL } from "./app.js";

const SALES_API_URL = `${BASE_URL}/sales`;

async function createSaleApi(saleData) {

    const token = sessionStorage.getItem("token");

    const response = await fetch(
        `${SALES_API_URL}/create`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(saleData)
        }
    );

    const data = await response.json();

    if (response.status === 401) {
        throw new Error("TOKEN_EXPIRED");
    }

    if (!response.ok) {

        throw new Error(
            data.message || "Error al crear venta"
        );

    }

    return data;

}

async function getSalesByUserApi(id_usuario) {

    const response = await fetch(
        `${SALES_API_URL}/user`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_usuario
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.message || "Error al obtener ventas del usuario"
        );

    }

    return data;

}

window.createSaleApi = createSaleApi;
window.getSalesByUserApi = getSalesByUserApi;

export {
    createSaleApi,
    getSalesByUserApi
};
import axios from "axios";

const cartInstance = axios.create({
    baseURL: "/api/cart/",
    withCredentials: true,
});

export async function getCart() {
    const res = await cartInstance.get("/");
    return res.data;
}

export async function addToCart(productId, variantId, quantity) {
    const res = await cartInstance.post("/addToCart", {
        productId,
        variantId,
        quantity,
    });
    return res.data;
}

export async function removeFromCart(productId, variantId) {
    const res = await cartInstance.delete("/removeFromCart", {
        data: { productId, variantId },
    });
    return res.data;
}

export async function updateCartItem(productId, variantId, quantity) {
    const res = await cartInstance.put("/updateCartItem", {
        productId,
        variantId,
        quantity,
    });
    return res.data;
}
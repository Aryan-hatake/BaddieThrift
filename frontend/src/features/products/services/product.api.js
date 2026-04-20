import axios from 'axios'

const productApi = axios.create({
    baseURL: "/api/product",
    withCredentials: true
})


export async function createProduct(formData) {

    const res = await productApi.post("/createProduct", formData, { headers: { 'Content-Type': 'multipart/form-data' } })

    return res.data
}
export async function getSellerProducts() {
    const res = await productApi.get("/getSellerProducts")
    return res.data
}

export async function getAllProducts(params = {}) {
    const res = await productApi.get("/getAllProducts", { params })
    return res.data
}

export async function getProductDetails(id){
    const res = await productApi.get(`/details/${id}`)
    return res.data
}
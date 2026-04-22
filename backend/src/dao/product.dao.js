import productModel from "../model/product.model.js";

export async function findOneProduct(productId) {
    return await productModel.findById(productId)
}

export async function updateProduct(productId,data) {
    return await productModel.findByIdAndUpdate(productId,data,{new:true})
}

export async function deleteProduct(productId) {
    return await productModel.findByIdAndDelete(productId)
}
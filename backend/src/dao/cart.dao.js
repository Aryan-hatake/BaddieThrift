import cartModel from "../model/cart.model.js";

export async function userCart(userId) {
    try {
        const cart = (await cartModel.findOne({ user: userId }).populate("items.product")) || (await cartModel.create({user:userId}))
        return cart
    } catch (error) {
        throw error
    }
}

export async function createCart(userId) {
    try {
        const cart = await cartModel.create({ user: userId })
        return cart 
    } catch (error) {
        console.log(error)
    }
}

 
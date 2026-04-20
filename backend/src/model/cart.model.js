import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
            },
            variant: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products.variants"
            },
            quantity: {
                type: Number,
                default:1,
                min:1
            },
        
        }
    ]
}, { timestamps: true })

const cartModel = mongoose.model("cart", cartSchema)

export default cartModel
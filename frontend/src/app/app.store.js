import { configureStore } from "@reduxjs/toolkit";
import  authReducer  from "../features/auth/auth.slice";
import productSlice from '../features/products/store/product.slice'
import cartSlice from '../features/cart/store/cart.slice'
import archiveSlice from '../features/products/store/archive.slice'


export const store = configureStore({
    reducer:{
        auth:authReducer,
        product:productSlice,
        cart:cartSlice,
        archive:archiveSlice
    }
})
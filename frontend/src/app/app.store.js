import { configureStore } from "@reduxjs/toolkit";
import  authReducer  from "../features/auth/auth.slice";
import productSlice from '../features/products/store/product.slice'

export const store = configureStore({
    reducer:{
        auth:authReducer,
        product:productSlice
    }
})
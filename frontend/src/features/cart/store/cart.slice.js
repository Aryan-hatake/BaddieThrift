import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cartItems: [],
        loading: false,
        error: null,
    },
    reducers: {
        setCartItems: (state, action) => {
            state.cartItems = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setAddCart: (state, action) => {
            state.cartItems.push(action.payload);
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        removeItemFromCart: (state, action) => {
            const { productId, variantId } = action.payload;
            state.cartItems = state.cartItems.filter((item) => {
                const pId = item.product?._id ?? item.product;
                const vId = item.variant?._id ?? item.variant;
                if (variantId) {
                    return !(pId === productId && vId === variantId);
                }
                return pId !== productId;
            });
        },
        updateItemQuantity: (state, action) => {
            const { productId, variantId, quantity } = action.payload;
            const item = state.cartItems.find((i) => {
                const pId = i.product?._id ?? i.product;
                const vId = i.variant?._id ?? i.variant;
                return  pId === productId && vId === variantId;
            });
           
            if (item && item.quantity < item.variant.stock) item.quantity+=quantity;
        },
    },
});

export const {
    setCartItems,
    setError,
    setLoading,
    removeItemFromCart,
    updateItemQuantity,
    setAddCart,
} = cartSlice.actions;

export default cartSlice.reducer;
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
                if (variantId) return pId === productId && vId === variantId;
                return pId === productId;
            });
            if (item) item.quantity+=quantity;
        },
    },
});

export const {
    setCartItems,
    setError,
    setLoading,
    removeItemFromCart,
    updateItemQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
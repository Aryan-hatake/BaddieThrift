import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cartItems: [],
        loading: false,
        error: null,
        cartPrice: 0,
        cartCurrency:null
    },
    reducers: {
        setCartItems: (state, action) => {
            state.cartItems = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setAddCart: (state, action) => {

            const existingItem = state.cartItems.find((item)=>{
               if(item.product._id === action.payload.product._id && item.variant._id === action.payload.variant._id){
                    item.quantity += action.payload.quantity;
                    return item
               }
            })

          if(!existingItem){

              state.cartItems.push(action.payload);
          }
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
    
            if (item && item.quantity <= item.product.variants.stock){
        
                if(item.quantity+quantity <= item.product.variants.stock || quantity<0){
                    item.quantity+=quantity;
                }
            } 
                
        },
        setCartPrice:(state,action)=>{
            state.cartPrice = action.payload
        },
        setCartCurrency:(state,action)=>{
            state.cartCurrency = action.payload
        },
        setAddCartPrice:(state,action)=>{
            state.cartPrice+=action.payload
        },
        setDeductCartPrice:(state,action)=>{
            if(state.cartPrice - action.payload > 0){
                state.cartPrice -= action.payload
            }
        }
    },
});

export const {
    setCartItems,
    setError,
    setLoading,
    removeItemFromCart,
    updateItemQuantity,
    setAddCart,
    setCartPrice,
    setCartCurrency,
    setAddCartPrice,
    setDeductCartPrice
} = cartSlice.actions;

export default cartSlice.reducer;
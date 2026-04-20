import {createSlice} from '@reduxjs/toolkit'

const productSlice = createSlice({
    name:"product",
    initialState:{
        loading:false,
        sellerProducts:[],
        catalogProducts:[],
        selectedProduct: null,
        catalogTotal:0,
        catalogPage:1,
        catalogTotalPages:1,
        error:null
    },
    reducers:{
        setLoading:(state,action)=>{
            state.loading = action.payload
        },
        setError:(state,action)=>{
            state.error = action.payload
        },
        setProducts:(state,action)=>{
            state.sellerProducts = action.payload
        },
        setCatalogProducts:(state,action)=>{
            state.catalogProducts = action.payload.products
            state.catalogTotal = action.payload.total
            state.catalogPage = action.payload.page
            state.catalogTotalPages = action.payload.totalPages
        },
        setSelectedProduct:(state,action)=>{
           state.selectedProduct = action.payload
        }
    }
})

export const {setError , setLoading , setProducts, setCatalogProducts , setSelectedProduct } = productSlice.actions

export default productSlice.reducer

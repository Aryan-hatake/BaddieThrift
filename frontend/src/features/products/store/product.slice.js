import {createSlice} from '@reduxjs/toolkit'

const productSlice = createSlice({
    name:"product",
    initialState:{
        loading:false,
        sellerProducts:[],
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
        }
    }
})

export const {setError , setLoading , setProducts } = productSlice.actions

export default productSlice.reducer
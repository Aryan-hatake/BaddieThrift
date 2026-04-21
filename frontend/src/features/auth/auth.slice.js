import { createSlice } from "@reduxjs/toolkit";

export  const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        loading:true,
        error:null,
        logout: localStorage.getItem("google_login") ? false : true
    },
    reducers:{
        setUser:(state,action)=>{
           state.user = action.payload
        },
        setLoading:(state,action)=>{
            state.loading = action.payload
        },
        setError: (state,action)=>{
            state.error = action.payload
        },
        setLogout: (state,action)=>{
            state.logout = action.payload
        }
    }
})

export const {setError,setUser,setLoading,setLogout} = authSlice.actions

export default authSlice.reducer
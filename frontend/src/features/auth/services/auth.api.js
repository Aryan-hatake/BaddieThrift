import axios from 'axios'

const api = axios.create({
    baseURL:"/api/auth",
    withCredentials:true
})


export const register = async(fullName,email,password,contactNo)=>{
    const res = await api.post("/register",{fullName,email,password,contactNo})
    return res.data
}

export const login = async(email,contactNo, password)=>{
    const res = await api.post("/login",{ email,contactNo, password })
    return res.data
}
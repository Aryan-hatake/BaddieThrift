import axios from "axios";

const ArchieveApi = axios.create({
    baseURL : "/api/archive",
    withCredentials: true,
}) 

export  const  addToArchiveApi = async(productId,variantId)=>{
    try {
        const response = await ArchieveApi.post("/add",{productId,variantId});
        return response.data;
    }
    catch(error){
        throw error;
    }
}

export const removeFromArchiveApi = async(productId,variantId)=>{
    try {
        const response = await ArchieveApi.delete(`/delete/${productId}/${variantId}`);
        return response.data;
    }
    catch(error){
        throw error;
    }
}

export const getArchiveApi = async()=>{
    try {
        const response = await ArchieveApi.get();
        return response.data;
    }
    catch(error){
        throw error;
    }
}



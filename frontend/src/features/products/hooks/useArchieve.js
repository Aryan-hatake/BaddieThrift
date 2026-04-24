import { useDispatch } from "react-redux";
import { addToArchive, removeFromArchive, setErr, setLoading, setArchiveItems  } from "../store/archive.slice";
import { removeFromArchiveApi ,addToArchiveApi ,getArchiveApi } from "../services/archieve.api";


export function useArchieve(){
    const dispatch = useDispatch();
    
    const handleAddToArchieve = async(productId,variantId)=>{
        try{
            dispatch(setLoading(true));
            const response = await addToArchiveApi(productId,variantId)
            dispatch(addToArchive(response.archivedProduct))
        }
        catch(error){
            dispatch(setErr(error.message));
        }
        finally{
            dispatch(setLoading(false));
        }
    }

    const handleRemoveToArchieve = async(productId,variantId)=>{
        try{
            dispatch(setLoading(true));
            dispatch(removeFromArchive({productId,variantId}));
            await removeFromArchiveApi(productId,variantId)
            

        }
        catch(error){
            dispatch(setErr(error.message));
        }
        finally{
            dispatch(setLoading(false));
        }
    }

    const handleGetArchive = async()=>{
        try{
            dispatch(setLoading(true));
            const response = await getArchiveApi();
      
            dispatch(setArchiveItems(response.items));
            

        }
        catch(error){
            dispatch(setErr(error.message));
        }
        finally{
            dispatch(setLoading(false));
        }
    }



    return{
        handleAddToArchieve,
        handleRemoveToArchieve,
        handleGetArchive
    }
}
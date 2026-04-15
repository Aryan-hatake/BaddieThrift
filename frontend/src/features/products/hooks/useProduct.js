import { useDispatch } from 'react-redux'
import { setError, setLoading , setProducts } from '../store/product.slice';
import { createProduct , getSellerProducts} from '../services/product.api';

export function useProduct() {

   const dispatch = useDispatch();

   async function handleCreateProduct(data) {
      dispatch(setLoading(true))
      try {

         const newImageArr = data.images.map((image) => {
            return image ? image?.file : null
         })
         data.images = newImageArr

         const response = await createProduct(data)
         console.log(response)
         return response?.product

      }
      catch (err) {
         console.log(err)
         dispatch(setError(err.message))
      }
      finally {
         dispatch(setLoading(false))
      }
   }
   
   async function handleSellerProducts() {
      dispatch(setLoading(true))
      try {
         const response = await getSellerProducts()
         console.log(response)
          dispatch(setProducts(response?.allProducts))
         return response?.allProducts
      }
      catch (err) {
         console.log(err)
         dispatch(setError(err.message))
      }
      finally {
         dispatch(setLoading(false))
      }
   }

   return { handleCreateProduct , handleSellerProducts }
}
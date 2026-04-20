import { useDispatch } from 'react-redux'
import { setError, setLoading, setProducts, setCatalogProducts, setSelectedProduct } from '../store/product.slice';
import { createProduct, getSellerProducts, getAllProducts, getProductDetails } from '../services/product.api';

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
         return response?.product
      }
      catch (err) {
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
         dispatch(setProducts(response?.allProducts))
         return response?.allProducts
      }
      catch (err) {

         dispatch(setError(err.message))
      }
      finally {
         dispatch(setLoading(false))
      }
   }

   async function handleGetAllProducts(params = {}) {
      dispatch(setLoading(true))
      try {
         const response = await getAllProducts(params)
         dispatch(setCatalogProducts({
            products: response?.products ?? [],
            total: response?.total ?? 0,
            page: response?.page ?? 1,
            totalPages: response?.totalPages ?? 1,
         }))
         return response
      }
      catch (err) {
         dispatch(setError(err.message))
      }
      finally {
         dispatch(setLoading(false))
      }
   }
   async function handleProductDetails(id) {
      try{
         dispatch(setLoading(true))
         const response = await getProductDetails(id);
         dispatch(setSelectedProduct(response?.product ?? response))
      }
      catch(err){
         dispatch(setError(err?.message ?? err))
      }
      finally{
         dispatch(setLoading(false))
      }
   }

   return { handleCreateProduct, handleSellerProducts, handleGetAllProducts , handleProductDetails }
}

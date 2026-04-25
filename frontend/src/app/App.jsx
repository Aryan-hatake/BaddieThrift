import { RouterProvider } from "react-router-dom";
import { router } from "./app.routes";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useCart } from "../features/cart/hooks/useCart";
import { useArchieve } from "../features/products/hooks/useArchieve";

function App() {
  const { handleGetMe } = useAuth();
  const {handleGetCart} = useCart()
  const {handleGetArchive} = useArchieve();
  const user = useSelector((state) => state.auth.user);
  const errAuth = useSelector((state) => state.auth.error);
  const errProduct = useSelector((state) => state.product.error);
  const logout = useSelector((state) => state.auth.logout);


   
  

  useEffect(() => {

    if(!logout){
      (async function () {
        await handleGetMe();
      })();
    }
    }, []);
   useEffect(() => {
       if(user){
        handleGetArchive();
     }
    }, [user]);

  useEffect(()=>{
     if(user){
        handleGetCart()
     }
  },[user])

  console.log(user)
  console.log("ERR AUTH: ", errAuth);
  console.log("ERR PRODUCT", errProduct);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;

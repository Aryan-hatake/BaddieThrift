import { RouterProvider } from "react-router-dom";
import { router } from "./app.routes";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useEffect } from "react";
import { useSelector } from "react-redux";


function App() {
  const { handleGetMe } = useAuth();
  
  const user = useSelector((state) => state.auth.user);
  const errAuth = useSelector((state) => state.auth.error);
  const errProduct = useSelector((state) => state.product.error);
  const logout = useSelector((state) => state.auth.logout);
  const loading = useSelector((state) => state.auth.loading);
  
  console.log("LOADING: ",loading)
  useEffect(() => {
    console.log("LOGOUT: ",logout)
    if(!logout){
      (async function () {
        await handleGetMe();
      })();
    }
    }, []);

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

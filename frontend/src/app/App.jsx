import { RouterProvider } from "react-router-dom";
import { router } from "./app.routes";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function App() {
  const { handleGetMe } = useAuth();

  useEffect(() => {
    (async function () {
      await handleGetMe();
    })();
  }, []);
  
  const user = useSelector((state) => state.auth.user);
  const errAuth = useSelector((state) => state.auth.error);
  const errProduct = useSelector((state) => state.product.error);

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

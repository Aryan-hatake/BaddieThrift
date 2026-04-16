import { createBrowserRouter } from "react-router-dom";
import Register from "../features/auth/UI/Register";
import Login from "../features/auth/UI/Login";
import CreateProduct from "../features/products/UI/pages/CreateProduct";
import SellerInventory from "../features/products/UI/pages/SellerInventory";
import Protected from "../features/auth/UI/components/Protected";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <h1>Helloo</h1>,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/seller/create-product",
    element: (
      <Protected>
        <CreateProduct />
      </Protected>
    ),
  },
  {
    path: "/seller/inventory",
    element: <Protected>
        <SellerInventory/>
    </Protected>,
  },
]);

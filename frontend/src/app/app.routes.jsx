import { createBrowserRouter } from "react-router-dom";
import Register from "../features/auth/UI/Register";
import Login from "../features/auth/UI/Login";
import CreateProduct from "../features/products/UI/pages/CreateProduct";
import SellerInventory from "../features/products/UI/pages/SellerInventory";
import ProductCatalog from "../features/products/UI/pages/ProductCatalog";
import ProductDetails from "../features/products/UI/pages/ProductDetails";
import Protected from "../features/auth/UI/components/Protected";
import Cart from "../features/cart/UI/pages/Cart";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProductCatalog />,
  },
  {
    path: "/catalog",
    element: <ProductCatalog />,
  },
  {
    path: "/product/:id/:variantId?",
    element: <ProductDetails />,
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
    path: "/seller",
    children: [
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
        element: (
          <Protected>
            <SellerInventory />
          </Protected>
        ),
      },
    ],
  },
  {
    path:"cart/:user",
    element:<Cart/>
  }
]);


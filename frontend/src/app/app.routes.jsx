import { createBrowserRouter } from "react-router-dom";
import Register from "../features/auth/UI/Register";
import Login from "../features/auth/UI/Login";
import CreateProduct from "../features/products/UI/pages/CreateProduct";
import SellerInventory from "../features/products/UI/pages/SellerInventory";
import ProductCatalog from "../features/products/UI/pages/ProductCatalog";
import ProductDetails from "../features/products/UI/pages/ProductDetails";
import Archive from "../features/products/UI/pages/Archive";
import Protected from "../features/auth/UI/components/Protected";
import Cart from "../features/cart/UI/pages/Cart";
import ProductLayout from "../layout/ProductLayout";
import AuthLayout from "../layout/AuthLayout";
import SellerLayout from "../layout/SellerLayout";
import SellerManageProduct from "../features/products/UI/pages/sellerManageProduct";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProductLayout />,
    children: [
      {
        index: true,
        element: <ProductCatalog />,
      },
      {
        path: "cart/:user",
        element: <Cart />
      },
      {
        path: "product/:id/:variantId?",
        element: <ProductDetails />,
      },
      {
        path: "archive",
        element: <Archive />,
      },
    ]
  },
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      {
        path: "register",
        element: <Register />
      },
      {
        path: "login",
        element: <Login />
      }
    ]
  },
  {
    path: "seller",
    element: <SellerLayout />,
    children: [
      {
        path: "create-product",
        element: (
          <Protected>
            <CreateProduct/>
          </Protected>
        )
      },
      {
        index:true,
        element: (
          <Protected>
            <SellerInventory />
          </Protected>
        )
      },
      {
        path: "manage-product/:id",
        element: (
          <Protected>
            <SellerManageProduct />
          </Protected>
        )
      }
    ]
  }
]
);


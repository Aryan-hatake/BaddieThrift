import { createBrowserRouter } from "react-router-dom";
import Register from "../features/auth/UI/Register";
import Login from "../features/auth/UI/Login";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <h1>Helloo</h1>
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/login",
        element: <Login />
    },
])
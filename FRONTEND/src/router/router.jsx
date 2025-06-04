import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import ErrorPage from "../pages/ErrorPage";
import RoutLayout from "../layouts/RootLayout";
import Products from "../pages/Products";
import ProductDetail from "../pages/ProductDetail";
import Cart from "../pages/Cart";
import Orders from "../pages/Orders";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { ROUTES } from "./path";
import Filters from "../pages/Filters";
import Profile from "../pages/Profile";
import ProtectedRoute from "../components/ProtectedRoute";

export const router = createBrowserRouter([
    {
        path: ROUTES.HOME,
        element: <RoutLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Home /> // Todos pueden acceder
            },
            {
                path: ROUTES.PRODUCTS,
                element: <Products /> // Todos pueden acceder
            },
            {
                path: ROUTES.PRODUCT_DETAIL,
                element: <ProductDetail />
            },
            {
                path: ROUTES.LOGIN,
                element: <Login />
            },
            {
                path: ROUTES.REGISTER,
                element: <Register />
            },
            {
                path: ROUTES.PROFILE,
                element: <ProtectedRoute allowedRoles={["ROLE_USER", "ROLE_ADMIN"]} />,
                children: [{ index: true, element: <Profile /> }]
            },
            {
                path: ROUTES.ORDERS,
                element: <ProtectedRoute allowedRoles={["ROLE_USER", "ROLE_ADMIN"]} />,
                children: [{ index: true, element: <Orders /> }]
            },
            {
                path: ROUTES.CART,
                element: <ProtectedRoute allowedRoles={["ROLE_USER"]} />,
                children: [{ index: true, element: <Cart /> }]
            },
            {
                path: ROUTES.FILTERS,
                element: <ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />,
                children: [{ index: true, element: <Filters /> }]
            }
        ]
    }
]);

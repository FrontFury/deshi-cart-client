import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import { About, AuthPage, Contact, Dashboard, Home, NotFound, Products } from "../App";
import PrivateRoute from "./PrivateRoute";
import { AddProductPage, AllProductsPage, CartPage, ManageOrdersPage, OrdersPage, ProfilePage, ShopProfilePage, WishlistPage } from "../pages/AccountPages";

export const router = createBrowserRouter([{
  path: "/",
  Component: RootLayout,
  children: [
    { index: true, Component: Home },
    { path: "products", Component: Products },
    { path: "about", Component: About },
    { path: "contact", Component: Contact },
    { path: "login", element: <AuthPage mode="login" /> },
    { path: "signup", element: <AuthPage mode="signup" /> },
    { path: "dashboard", element: <PrivateRoute><Dashboard /></PrivateRoute> },
    { path: "profile", element: <PrivateRoute><ProfilePage /></PrivateRoute> },
    { path: "cart", element: <PrivateRoute><CartPage /></PrivateRoute> },
    { path: "wishlist", element: <PrivateRoute><WishlistPage /></PrivateRoute> },
    { path: "my-orders", element: <PrivateRoute><OrdersPage /></PrivateRoute> },
    { path: "shop-profile", element: <PrivateRoute><ShopProfilePage /></PrivateRoute> },
    { path: "add-product", element: <PrivateRoute><AddProductPage /></PrivateRoute> },
    { path: "all-products", element: <PrivateRoute><AllProductsPage /></PrivateRoute> },
    { path: "manage-orders", element: <PrivateRoute><ManageOrdersPage /></PrivateRoute> },
    { path: "*", Component: NotFound },
  ],
}]);

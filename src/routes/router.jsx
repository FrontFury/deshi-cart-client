import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import { About, AuthPage, Contact, Dashboard, Home, NotFound, Products } from "../App";
import PrivateRoute from "./PrivateRoute";
import { AddProductPage, AdminPendingProductsPage, AdminUsersPage, AllProductsPage, ManageOrdersPage, OrdersPage, ProfilePage, ServerCartPage, ServerWishlistPage, ShopProfilePage } from "../pages/AccountPages";
import RoleRoute from "./RoleRoute";

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
    { path: "profile", element: <PrivateRoute><RoleRoute allowedRoles={["customer"]}><ProfilePage /></RoleRoute></PrivateRoute> },
    { path: "cart", element: <PrivateRoute><RoleRoute allowedRoles={["customer"]}><ServerCartPage /></RoleRoute></PrivateRoute> },
    { path: "wishlist", element: <PrivateRoute><RoleRoute allowedRoles={["customer"]}><ServerWishlistPage /></RoleRoute></PrivateRoute> },
    { path: "my-orders", element: <PrivateRoute><RoleRoute allowedRoles={["customer"]}><OrdersPage /></RoleRoute></PrivateRoute> },
    { path: "shop-profile", element: <PrivateRoute><RoleRoute allowedRoles={["seller", "shopkeeper", "shopkeeperrole"]}><ShopProfilePage /></RoleRoute></PrivateRoute> },
    { path: "add-product", element: <PrivateRoute><RoleRoute allowedRoles={["seller", "shopkeeper", "shopkeeperrole"]}><AddProductPage /></RoleRoute></PrivateRoute> },
    { path: "all-products", element: <PrivateRoute><RoleRoute allowedRoles={["seller", "shopkeeper", "shopkeeperrole"]}><AllProductsPage /></RoleRoute></PrivateRoute> },
    { path: "manage-orders", element: <PrivateRoute><RoleRoute allowedRoles={["seller", "shopkeeper", "shopkeeperrole"]}><ManageOrdersPage /></RoleRoute></PrivateRoute> },
    { path: "admin/users", element: <PrivateRoute><RoleRoute allowedRoles={["admin"]}><AdminUsersPage /></RoleRoute></PrivateRoute> },
    { path: "admin/pending-products", element: <PrivateRoute><RoleRoute allowedRoles={["admin"]}><AdminPendingProductsPage /></RoleRoute></PrivateRoute> },
    { path: "*", Component: NotFound },
  ],
}]);

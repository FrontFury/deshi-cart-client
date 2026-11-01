import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import { About, AuthPage, Contact, Home, NotFound, Products } from "../App";

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
    { path: "*", Component: NotFound },
  ],
}]);

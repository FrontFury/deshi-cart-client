import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ChevronDown, Menu, ShoppingBag, UserRound, X } from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import useRole from "../../../hooks/useRole";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const { user, logOut } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { data: cartItems = [] } = useQuery({
    queryKey: ["cart", user?.uid],
    queryFn: async () => (await axiosSecure.get("/api/cart")).data,
    enabled: Boolean(user?.email),
  });
  const { role, roleLoading, roleError } = useRole();
  const normalizedRole = String(role).trim().toLowerCase();
  const isAdmin = normalizedRole === "admin";
  const isShopkeeper = ["seller", "shopkeeper", "shopkeeperrole"].includes(normalizedRole);
  const accountLinks = isAdmin
    ? [["/admin/users", "All Users"], ["/admin/pending-products", "Pending Products"]]
    : isShopkeeper
    ? [["/shop-profile", "Shop Profile"], ["/add-product", "Add Product"], ["/all-products", "All Product"], ["/manage-orders", "Manage Order"]]
    : [["/profile", "Add Profile"], ["/cart", "Cart"], ["/wishlist", "Wishlist"], ["/my-orders", "My order"]];
  const links = [["/", "Home"], ["/products", "Shop"], ["/about", "Our story"], ["/contact", "Contact"]];
  const handleLogout = async () => {
    setAccountOpen(false);
    setIsOpen(false);
    await logOut();
  };
  const cartCount = cartItems.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
  return <header className="site-header"><nav className="nav container"><Link className="brand" to="/" aria-label="DeshiCart home"><img src="/DeshiCartLogo.png" alt="DeshiCart" /></Link><div className={isOpen ? "nav-links open" : "nav-links"}>{links.map(([to, label]) => <NavLink key={to} to={to} end={to === "/"} onClick={() => setIsOpen(false)}>{label}</NavLink>)}</div><div className="nav-actions"><Link className="cart-link" to="/cart" aria-label={`Shopping bag with ${cartCount} items`}><ShoppingBag size={20} /><span>{cartCount}</span></Link>{user ? <div className="account-menu"><button className="account-button" onClick={() => setAccountOpen(!accountOpen)} aria-expanded={accountOpen} aria-label="Open account menu"><UserRound size={19} /><ChevronDown size={14} /></button>{accountOpen && <div className="account-dropdown"><p>{user.displayName || user.email}</p><Link to="/dashboard" onClick={() => setAccountOpen(false)}>Dashboard</Link>{roleLoading ? <span className="account-loading">Loading menu...</span> : roleError ? <span className="account-loading">Unable to load role</span> : accountLinks.map(([to, label]) => <Link key={to} to={to} onClick={() => setAccountOpen(false)}>{label}</Link>)}<button onClick={handleLogout}>Logout</button></div>}</div> : <Link className="btn btn-small" to="/login">Sign in</Link>}</div><button className="menu-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation">{isOpen ? <X /> : <Menu />}</button></nav></header>;
};

export default Navbar;

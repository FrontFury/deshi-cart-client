import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, ShoppingBag, X } from "lucide-react";
import useAuth from "../../../hooks/useAuth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { user, logOut } = useAuth();
  const links = [["/", "Home"], ["/products", "Shop"], ["/about", "Our story"], ["/contact", "Contact"]];
  return <header className="site-header"><nav className="nav container"><Link className="brand" to="/" aria-label="DeshiCart home"><img src="/DeshiCartLogo.png" alt="DeshiCart" /></Link><div className={isOpen ? "nav-links open" : "nav-links"}>{links.map(([to, label]) => <NavLink key={to} to={to} end={to === "/"} onClick={() => setIsOpen(false)}>{label}</NavLink>)}<div className="mobile-auth">{user ? <button onClick={logOut}>Sign out</button> : <Link to="/login">Sign in</Link>}</div></div><div className="nav-actions"><Link className="cart-link" to="/products" aria-label="Shopping bag"><ShoppingBag size={20} /><span>0</span></Link>{user ? <button className="avatar" onClick={logOut} title="Sign out">{(user.displayName || user.email || "U")[0].toUpperCase()}</button> : <Link className="btn btn-small" to="/login">Sign in</Link>}</div><button className="menu-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation">{isOpen ? <X /> : <Menu />}</button></nav></header>;
};

export default Navbar;

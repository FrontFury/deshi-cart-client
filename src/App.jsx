import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight, Check, Heart, Leaf, Search, ShieldCheck,
  ShoppingBag, Star, Truck, UserRound,
} from "lucide-react";
import useAuth from "./hooks/useAuth";
import useCreateUser from "./hooks/useCreateUser";
import useAxios from "./hooks/useAxios";
import useAxiosSecure from "./hooks/useAxiosSecure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "./App.css";

// eslint-disable-next-line react-refresh/only-export-components
export const products = [
  { id: 1, name: "Classic Handloom Saree", category: "Sarees", price: 1850, oldPrice: 2200, rating: 4.9, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80", tag: "Best seller" },
  { id: 2, name: "Embroidered Cotton Panjabi", category: "Menswear", price: 1450, oldPrice: 1750, rating: 4.8, image: "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?auto=format&fit=crop&w=800&q=80", tag: "New" },
  { id: 3, name: "Jamdani Dupatta", category: "Accessories", price: 890, oldPrice: 1100, rating: 4.7, image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80", tag: "Handwoven" },
  { id: 4, name: "Linen Relaxed Shirt", category: "Menswear", price: 1250, oldPrice: 1500, rating: 4.9, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80", tag: "Bestseller" },
  { id: 5, name: "Artisan Leather Tote", category: "Accessories", price: 1650, oldPrice: 1950, rating: 4.8, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80", tag: "Handmade" },
  { id: 6, name: "Block Print Kurti", category: "Womenswear", price: 1150, oldPrice: 1400, rating: 4.6, image: "https://images.unsplash.com/photo-1583391733981-849840f6c6d5?auto=format&fit=crop&w=800&q=80", tag: "New arrival" },
];

const money = (value) => `৳${value.toLocaleString("en-BD")}`;

function ProductCard({ product, onAdd, onWishlist }) {
  return (
    <article className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        <span className="product-tag">{product.tag || product.status || "Approved"}</span>
        <button className="icon-button product-heart" onClick={() => onWishlist?.(product)} aria-label={`Add ${product.name} to wishlist`}><Heart size={18} /></button>
      </div>
      <div className="product-info">
        <p className="eyebrow">{product.category}</p>
        <h3>{product.name}</h3>
        <div className="rating"><Star size={15} fill="currentColor" /> {product.rating} <span>(24)</span></div>
        <div className="product-bottom"><div><strong>{money(Number(product.price) || 0)}</strong>{product.oldPrice && <del>{money(product.oldPrice)}</del>}</div><button className="add-button" onClick={() => onAdd?.(product)} aria-label={`Add ${product.name} to cart`}><ShoppingBag size={18} /></button></div>
      </div>
    </article>
  );
}

export function Home() {
  const [notice, setNotice] = useState("");
  const axiosPublic = useAxios();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: homeProducts = [], isLoading, isError } = useQuery({
    queryKey: ["approved-products"],
    queryFn: async () => (await axiosPublic.get("/api/products")).data,
  });
  const requireLogin = () => {
    if (!user) {
      navigate("/login", { state: { from: "/" } });
      return false;
    }
    return true;
  };
  const add = (product) => { if (!requireLogin()) return; setNotice(`${product.name} added to your cart.`); window.setTimeout(() => setNotice(""), 2400); };
  const addToWishlist = (product) => { if (!requireLogin()) return; setNotice(`${product.name} saved to your wishlist.`); window.setTimeout(() => setNotice(""), 2400); };
  return <main>
    {notice && <div className="toast"><Check size={18} /> {notice}</div>}
    <section className="hero-section"><div className="hero-content"><p className="eyebrow">Style made locally</p><h1>Wear your story with <em>pride.</em></h1><p className="hero-copy">Discover thoughtfully designed fashion, handwoven textiles, and timeless accessories from independent makers across Bangladesh.</p><div className="hero-actions"><Link className="btn btn-primary" to="/products">Shop the collection <ArrowRight size={18} /></Link><Link className="text-link" to="/about">Our story <ArrowRight size={16} /></Link></div><div className="trust-row"><span><ShieldCheck size={19} /> Quality checked</span><span><Truck size={19} /> Nationwide delivery</span></div></div><div className="hero-art"><div className="hero-circle"></div><img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85" alt="Handwoven traditional fashion" /></div></section>
    <section className="section"><div className="section-heading"><div><p className="eyebrow">Curated for you</p><h2>Our favourites</h2></div><Link className="text-link" to="/products">View all products <ArrowRight size={16} /></Link></div>{isLoading && <div className="empty-state"><p>Loading our favourites...</p></div>}{isError && <div className="empty-state"><p>Could not load products right now.</p></div>}{!isLoading && !isError && homeProducts.length === 0 && <div className="empty-state"><h2>No products available yet</h2><p>Check back soon for new arrivals.</p></div>}{!isLoading && !isError && homeProducts.length > 0 && <div className="product-grid">{homeProducts.slice(0, 12).map((p) => <ProductCard key={p._id || p.id} product={p} onAdd={add} onWishlist={addToWishlist} />)}</div>}</section>
    <section className="story-banner"><div><p className="eyebrow">From our looms to your wardrobe</p><h2>Every outfit can support a local maker.</h2><p>We work directly with weavers, designers, and artisans, so your personal style creates a meaningful difference.</p><Link className="btn btn-light" to="/about">Meet our makers <ArrowRight size={18} /></Link></div><div className="story-stat"><strong>120+</strong><span>fashion makers in our community</span></div></section>
    <section className="section benefits"><div><Leaf /><strong>Made with care</strong><span>Small-batch and thoughtfully sourced.</span></div><div><Truck /><strong>Easy delivery</strong><span>Fast, reliable delivery to your door.</span></div><div><ShieldCheck /><strong>Shop with confidence</strong><span>Secure payments and easy returns.</span></div></section>
  </main>;
}

export function Products() {
  const axiosPublic = useAxios();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const { data: approvedProducts = [], isLoading, isError } = useQuery({
    queryKey: ["approved-products"],
    queryFn: async () => (await axiosPublic.get("/api/products")).data,
  });
  const addCart = useMutation({
    mutationFn: (product) => axiosSecure.post("/api/cart", {
      productId: product._id || product.id,
      name: product.name,
      price: Number(product.price) || 0,
      image: product.image,
      quantity: 1,
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
  const addWishlist = useMutation({
    mutationFn: (product) => axiosSecure.post("/api/wishlist", {
      productId: product._id || product.id,
      name: product.name,
      category: product.category,
      price: Number(product.price) || 0,
      image: product.image,
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });
  const filtered = useMemo(() => approvedProducts.filter((p) => (category === "All" || p.category === category) && p.name.toLowerCase().includes(query.toLowerCase())), [approvedProducts, category, query]);
  const add = async (p) => {
    if (!user) { navigate("/login", { state: { from: "/products" } }); return; }
    try { await addCart.mutateAsync(p); setNotice(`${p.name} added to your cart.`); } catch (error) { setNotice(error.response?.data?.message || "Could not add product to cart."); }
    window.setTimeout(() => setNotice(""), 2400);
  };
  const addToWishlist = async (p) => {
    if (!user) { navigate("/login", { state: { from: "/products" } }); return; }
    try { await addWishlist.mutateAsync(p); setNotice(`${p.name} saved to your wishlist.`); } catch (error) { setNotice(error.response?.data?.message || "Could not save product."); }
    window.setTimeout(() => setNotice(""), 2400);
  };
  return <main className="page"><div className="page-heading"><p className="eyebrow">The fashion collection</p><h1>Find your next <em>favourite.</em></h1><p>Beautiful clothing and accessories with a story behind them, made by local designers and artisans.</p></div><div className="shop-tools"><div className="search-box"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search fashion..." /></div><div className="filter-row">{["All", "Sarees", "Womenswear", "Menswear", "Accessories"].map((item) => <button key={item} className={category === item ? "filter active" : "filter"} onClick={() => setCategory(item)}>{item}</button>)}</div></div>{notice && <div className="toast"><Check size={18} /> {notice}</div>}{isLoading && <div className="empty-state"><p>Loading approved products...</p></div>}{isError && <div className="empty-state"><p>Could not load products from the server.</p></div>}{!isLoading && !isError && <div className="product-grid">{filtered.map((p) => <ProductCard key={p._id || p.id} product={p} onAdd={add} onWishlist={addToWishlist} />)}</div>}{!isLoading && !isError && filtered.length === 0 && <div className="empty-state"><Search size={40} /><h2>No fashion items found</h2><p>Try a different search or category.</p></div>}</main>;
}

export function About() { return <main className="page"><div className="about-grid"><div><p className="eyebrow">Our story</p><h1>Style can be <em>meaningful.</em></h1><p className="lead">DeshiCart started with one simple belief: what we wear should make life better for the people who make it too.</p><p>We partner with independent designers, weavers, tailors, and small fashion businesses across Bangladesh. From handloom sarees to everyday essentials, every piece is selected for its quality, character, and the story it carries.</p><Link className="btn btn-primary" to="/products">Explore fashion <ArrowRight size={18} /></Link></div><img className="about-image" src="https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=1000&q=85" alt="Artisan weaving colourful fabric" /></div><div className="values-grid"><div className="value-card"><Leaf /><h3>Local craftsmanship</h3><p>Your purchase keeps local fashion skills and businesses growing.</p></div><div className="value-card"><Heart /><h3>Made with intention</h3><p>We choose timeless pieces designed to be loved and worn often.</p></div><div className="value-card"><ShieldCheck /><h3>Quality always</h3><p>Every garment is checked before it reaches your wardrobe.</p></div></div></main>; }

export function Contact() { const [sent, setSent] = useState(false); return <main className="page narrow"><div className="page-heading"><p className="eyebrow">We’re here to help</p><h1>Say <em>hello.</em></h1><p>Questions about an order, a product, or becoming a maker? Send us a message.</p></div>{sent ? <div className="success-panel"><Check size={42} /><h2>Message sent!</h2><p>Thanks for reaching out. We’ll get back to you within one business day.</p><button className="btn btn-primary" onClick={() => setSent(false)}>Send another</button></div> : <form className="contact-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}><label>Name<input required placeholder="Your name" /></label><label>Email<input required type="email" placeholder="you@example.com" /></label><label>Message<textarea required rows="5" placeholder="How can we help?" /></label><button className="btn btn-primary" type="submit">Send message <ArrowRight size={18} /></button></form>}</main>; }

export function Dashboard() { const { user } = useAuth(); return <main className="page dashboard-page"><div className="page-heading"><p className="eyebrow">Your account</p><h1>Welcome, <em>{user?.displayName || "shopper"}.</em></h1><p>Manage your DeshiCart account and discover your next favourite fashion piece.</p></div><div className="dashboard-grid"><div className="value-card"><UserRound size={25} /><h3>Profile</h3><p>{user?.email}</p></div><div className="value-card"><ShoppingBag size={25} /><h3>Your orders</h3><p>Your order history will appear here.</p></div><div className="value-card"><Heart size={25} /><h3>Wishlist</h3><p>Save pieces you love for later.</p></div></div><Link className="btn btn-primary" to="/products">Continue shopping <ArrowRight size={18} /></Link></main>; }

export function AccountPage({ title, description, shopkeeper = false }) {
  const { user } = useAuth();
  return <main className="page dashboard-page"><div className="page-heading"><p className="eyebrow">{shopkeeper ? "Shopkeeper workspace" : "Customer account"}</p><h1>{title}</h1><p>{description}</p></div><div className="success-panel"><UserRound size={40} /><h2>{shopkeeper ? "Welcome, shopkeeper" : "Welcome back"}</h2><p>{user?.email}</p><Link className="btn btn-primary" to={shopkeeper ? "/all-products" : "/products"}>{shopkeeper ? "View products" : "Continue shopping"} <ArrowRight size={18} /></Link></div></main>;
}

export function AuthPage({ mode = "login" }) { const { signInUser, registerUser, signInGoogle, updateUserProfile } = useAuth(); const { mutateAsync: createUser } = useCreateUser(); const navigate = useNavigate(); const location = useLocation(); const [error, setError] = useState(""); const [busy, setBusy] = useState(false); const isLogin = mode === "login"; const destination = location.state?.from?.pathname || "/"; const ensureServerUser = async (user, provider, name = user.displayName || "") => { try { await createUser({ uid: user.uid, name, email: user.email, photoURL: user.photoURL || "", role: "customer", provider }); } catch (err) { if (err.response?.status !== 409) throw err; } }; const submit = async (e) => { e.preventDefault(); setBusy(true); setError(""); const data = new FormData(e.currentTarget); try { if (isLogin) { const result = await signInUser(data.get("email"), data.get("password")); await ensureServerUser(result.user, "password"); } else { const result = await registerUser(data.get("email"), data.get("password")); const name = data.get("name"); if (name) await updateUserProfile({ displayName: name }); await ensureServerUser(result.user, "password", name || result.user.displayName || ""); } navigate(destination, { replace: true }); } catch (err) { setError(err?.response?.data?.message || err?.message?.replace("Firebase: ", "") || "Something went wrong. Please try again."); } finally { setBusy(false); } }; const handleGoogleLogin = async () => { setBusy(true); setError(""); try { const result = await signInGoogle(); await ensureServerUser(result.user, "google"); navigate(destination, { replace: true }); } catch (err) { setError(err?.response?.data?.message || err?.message || "Google sign in failed."); } finally { setBusy(false); } }; return <main className="auth-page"><div className="auth-card"><Link className="brand auth-brand" to="/" aria-label="DeshiCart home"><img src="/DeshiCartLogo.png" alt="DeshiCart" /></Link><p className="eyebrow">{isLogin ? "Welcome back" : "Join our community"}</p><h1>{isLogin ? "Sign in to your account" : "Create your account"}</h1><p className="muted">{isLogin ? "Continue discovering things made with care." : "Save favourites and keep track of your orders."}</p><form onSubmit={submit} className="auth-form">{!isLogin && <label>Full name<input name="name" required placeholder="Your name" /></label>}<label>Email address<input name="email" type="email" required placeholder="you@example.com" /></label><label>Password<input name="password" type="password" minLength="6" required placeholder="At least 6 characters" /></label>{error && <p className="form-error">{error}</p>}<button disabled={busy} className="btn btn-primary full" type="submit">{busy ? "Please wait..." : isLogin ? "Sign in" : "Create account"}</button></form><div className="auth-divider"><span>or</span></div><button disabled={busy} className="btn btn-outline full" onClick={handleGoogleLogin}>Continue with Google</button><p className="auth-switch">{isLogin ? "New to DeshiCart?" : "Already have an account?"} <Link to={isLogin ? "/signup" : "/login"}>{isLogin ? "Create an account" : "Sign in"}</Link></p></div></main>; }

export function NotFound() { return <main className="page empty-state"><p className="eyebrow">404</p><h1>That page wandered off.</h1><p>Let’s get you back to something good.</p><Link className="btn btn-primary" to="/">Back to home <ArrowRight size={18} /></Link></main>; }

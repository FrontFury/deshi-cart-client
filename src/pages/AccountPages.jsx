import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Edit3, Minus, Plus, ShoppingBag, Trash2, UserRound } from "lucide-react";
import useAuth from "../hooks/useAuth";
import useCreateProduct from "../hooks/useCreateProduct";
import useSaveProfile from "../hooks/useSaveProfile";
import useProfile from "../hooks/useProfile";
import useSellerProducts from "../hooks/useSellerProducts";
import { auth } from "../firebase/firebase.init";
import { products } from "../App";

const money = (value) => `৳${value.toLocaleString("en-BD")}`;

function PageHeader({ eyebrow, title, description }) {
  return <div className="page-heading"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div>;
}

function Panel({ children, className = "" }) {
  return <section className={`account-panel ${className}`}>{children}</section>;
}

export function ProfilePage() {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile("customer");
  const { mutateAsync: saveProfile, isPending, isSuccess, isError, error } = useSaveProfile("customer");
  const submit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await saveProfile({
      name: data.get("name"),
      phone: data.get("phone"),
      address: data.get("address"),
    });
  };
  return <main className="page account-page"><PageHeader eyebrow="Customer account" title={<>Complete your <em>profile.</em></>} description="Keep your details up to date for a smoother checkout and delivery experience." /><Panel><div className="panel-title"><div><h2>Personal details</h2><p>These details are only used to manage your orders.</p></div><UserRound /></div>{profileLoading ? <p className="muted">Loading saved profile...</p> : <form className="account-form" onSubmit={submit}><label>Full name<input name="name" defaultValue={profile?.name || user?.displayName || ""} placeholder="Your full name" required /></label><label>Email address<input type="email" defaultValue={user?.email || ""} readOnly /></label><label>Phone number<input name="phone" defaultValue={profile?.phone || ""} placeholder="+880 1XXX-XXXXXX" /></label><label>Delivery address<textarea name="address" defaultValue={profile?.address || ""} rows="3" placeholder="House, road, area, city" /></label>{isSuccess && <p className="success-message"><Check size={16} /> Customer profile saved successfully.</p>}{isError && <p className="form-error">{error?.response?.data?.message || "Could not save your profile."}</p>}<button disabled={isPending} className="btn btn-primary" type="submit">{isPending ? "Saving..." : "Save profile"}</button></form>}</Panel></main>;
}

export function CartPage() {
  const [quantity, setQuantity] = useState(1);
  const item = products[0];
  const subtotal = item.price * quantity;
  return <main className="page account-page"><PageHeader eyebrow="Your shopping bag" title={<>Ready to <em>checkout?</em></>} description="Review your selected pieces before placing your order." /><div className="split-layout"><Panel><div className="panel-title"><div><h2>Cart items</h2><p>1 item in your bag</p></div><ShoppingBag /></div><div className="line-item"><img src={item.image} alt={item.name} /><div className="line-item-info"><h3>{item.name}</h3><p>{item.category}</p><strong>{money(item.price)}</strong><div className="quantity"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity"><Minus size={15} /></button><span>{quantity}</span><button onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity"><Plus size={15} /></button></div></div><button className="delete-button" aria-label="Remove item"><Trash2 size={17} /></button></div></Panel><Panel className="order-summary"><h2>Order summary</h2><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div><span>Delivery</span><strong>৳80</strong></div><hr /><div className="summary-total"><span>Total</span><strong>{money(subtotal + 80)}</strong></div><button className="btn btn-primary full">Proceed to checkout</button></Panel></div></main>;
}

export function WishlistPage() {
  return <main className="page account-page"><PageHeader eyebrow="Saved for later" title={<>Your <em>wishlist.</em></>} description="Keep the pieces you love close by." /><div className="wishlist-grid">{products.slice(1, 5).map((product) => <article className="wishlist-card" key={product.id}><img src={product.image} alt={product.name} /><div><p className="eyebrow">{product.category}</p><h3>{product.name}</h3><strong>{money(product.price)}</strong><div><button className="btn btn-primary">Add to cart</button><button className="delete-button" aria-label={`Remove ${product.name}`}><Trash2 size={16} /></button></div></div></article>)}</div></main>;
}

export function OrdersPage() {
  const orders = [{ id: "DC-1048", date: "02 Nov 2026", status: "Delivered", item: "Classic Handloom Saree", total: 1930 }, { id: "DC-1031", date: "18 Oct 2026", status: "On the way", item: "Jamdani Dupatta", total: 970 }];
  return <main className="page account-page"><PageHeader eyebrow="Your purchases" title={<>My <em>orders.</em></>} description="Track your orders and revisit your DeshiCart purchases." /><Panel><div className="panel-title"><div><h2>Order history</h2><p>{orders.length} orders placed</p></div><ShoppingBag /></div><div className="orders-table">{orders.map((order) => <div className="order-row" key={order.id}><div><strong>{order.id}</strong><span>{order.date}</span></div><div><strong>{order.item}</strong><span>{money(order.total)}</span></div><span className={`status ${order.status === "Delivered" ? "delivered" : "transit"}`}>{order.status}</span><Link className="text-link" to="/contact">View details</Link></div>)}</div></Panel></main>;
}

export function ShopProfilePage() {
  const { data: profile, isLoading: profileLoading } = useProfile("seller");
  const { mutateAsync: saveProfile, isPending, isSuccess, isError, error } = useSaveProfile("seller");
  const submit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await saveProfile({
      shopName: data.get("shopName"),
      description: data.get("description"),
      contactEmail: data.get("contactEmail"),
      phone: data.get("phone"),
    });
  };
  return <main className="page account-page"><PageHeader eyebrow="Shopkeeper workspace" title={<>Build your shop's <em>identity.</em></>} description="Tell customers what makes your fashion store special." /><Panel><div className="panel-title"><div><h2>Shop profile</h2><p>This information appears on your public storefront.</p></div><Edit3 /></div>{profileLoading ? <p className="muted">Loading saved shop profile...</p> : <form className="account-form" onSubmit={submit}><label>Shop name<input name="shopName" defaultValue={profile?.shopName || ""} placeholder="Your shop name" required /></label><label>Shop description<textarea name="description" defaultValue={profile?.description || ""} rows="4" placeholder="Tell customers about your products and craft..." required /></label><div className="form-two-col"><label>Contact email<input name="contactEmail" type="email" defaultValue={profile?.contactEmail || ""} placeholder="shop@example.com" required /></label><label>Phone number<input name="phone" defaultValue={profile?.phone || ""} placeholder="+880 1XXX-XXXXXX" /></label></div>{profile?.updatedAt && <p className="saved-hint">Saved profile loaded from your shop account.</p>}{isSuccess && <p className="success-message"><Check size={16} /> Seller profile saved successfully.</p>}{isError && <p className="form-error">{error?.response?.data?.message || "Could not save your shop profile."}</p>}<button disabled={isPending} className="btn btn-primary" type="submit">{isPending ? "Saving..." : "Save shop profile"}</button></form>}</Panel></main>;
}

export function AddProductPage() {
  const { mutateAsync: createProduct, isPending, isSuccess, isError, error } = useCreateProduct();
  const [image, setImage] = useState("");
  const submit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await createProduct({
      name: data.get("name"),
      category: data.get("category"),
      price: Number(data.get("price")),
      description: data.get("description"),
      image: image.trim(),
      sellerEmail: auth.currentUser?.email || "",
      status: "active",
    });
    event.currentTarget.reset();
    setImage("");
  };
  return <main className="page account-page"><PageHeader eyebrow="Shopkeeper workspace" title={<>Add a new <em>product.</em></>} description="Create a beautiful listing for your next fashion piece." /><Panel><form className="account-form" onSubmit={submit}><label>Product name<input name="name" placeholder="e.g. Handloom Cotton Saree" required /></label><div className="form-two-col"><label>Category<select name="category" defaultValue="Sarees"><option>Sarees</option><option>Womenswear</option><option>Menswear</option><option>Accessories</option></select></label><label>Price (৳)<input name="price" type="number" min="1" placeholder="1850" required /></label></div><label>Description<textarea name="description" rows="4" placeholder="Describe fabric, fit, colour and care instructions..." required /></label><label>Product image URL<input value={image} onChange={(event) => setImage(event.target.value)} type="url" placeholder="https://example.com/product-image.jpg" required /></label>{isSuccess && <p className="success-message"><Check size={16} /> Product published successfully.</p>}{isError && <p className="form-error">{error?.response?.data?.message || "Could not publish product. Please try again."}</p>}<button disabled={isPending} className="btn btn-primary" type="submit">{isPending ? "Publishing..." : "Publish product"}</button></form></Panel></main>;
}

export function AllProductsPage() {
  const { data: sellerProducts = [], isLoading, isError } = useSellerProducts();
  return <main className="page account-page"><PageHeader eyebrow="Shopkeeper workspace" title={<>All <em>products.</em></>} description="Review and manage the products in your shop." /><Panel><div className="panel-title"><div><h2>Product catalogue</h2><p>{sellerProducts.length} active listings</p></div><Link className="btn btn-primary" to="/add-product">Add product</Link></div>{isLoading && <p className="muted">Loading your products...</p>}{isError && <p className="form-error">Could not load your products.</p>}{!isLoading && sellerProducts.length === 0 && <div className="empty-state"><ShoppingBag size={35} /><h2>No products yet</h2><p>Publish your first product to see it here.</p></div>}<div className="manage-list">{sellerProducts.map((product) => <div className="manage-row" key={product._id || product.id}><img src={product.image} alt="" /><div><strong>{product.name}</strong><span>{product.category} · {money(product.price)}</span></div><span className="status delivered">Active</span><button className="icon-action" aria-label={`Edit ${product.name}`}><Edit3 size={16} /></button></div>)}</div></Panel></main>;
}

export function ManageOrdersPage() {
  const orders = [{ id: "DC-1048", customer: "Tasnim Rahman", item: "Classic Handloom Saree", total: "৳1,930", status: "Processing" }, { id: "DC-1047", customer: "Nabila Ahmed", item: "Linen Relaxed Shirt", total: "৳1,330", status: "Shipped" }, { id: "DC-1046", customer: "Rafi Karim", item: "Artisan Leather Tote", total: "৳1,730", status: "Delivered" }];
  return <main className="page account-page"><PageHeader eyebrow="Shopkeeper workspace" title={<>Manage <em>orders.</em></>} description="Keep customers updated from payment to delivery." /><Panel><div className="panel-title"><div><h2>Recent orders</h2><p>Update status as orders move through fulfilment.</p></div><ShoppingBag /></div><div className="manage-list">{orders.map((order) => <div className="manage-row order-manage-row" key={order.id}><div><strong>{order.id} · {order.customer}</strong><span>{order.item} · {order.total}</span></div><select defaultValue={order.status} aria-label={`Status for ${order.id}`}><option>Processing</option><option>Shipped</option><option>Delivered</option></select><button className="icon-action" aria-label={`Save ${order.id}`}><Check size={16} /></button></div>)}</div></Panel></main>;
}

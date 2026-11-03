import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, ClipboardCheck, Edit3, Heart, Minus, Plus, ShoppingBag, Trash2, UserRound, Users, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../hooks/useAuth";
import useCreateProduct from "../hooks/useCreateProduct";
import useSaveProfile from "../hooks/useSaveProfile";
import useProfile from "../hooks/useProfile";
import useSellerProducts from "../hooks/useSellerProducts";
import useAxiosSecure from "../hooks/useAxiosSecure";
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

export function ServerCartPage() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const { data: cartItems = [], isLoading, isError } = useQuery({ queryKey: ["cart"], queryFn: async () => (await axiosSecure.get("/api/cart")).data });
  const updateQuantity = useMutation({ mutationFn: ({ id, quantity }) => axiosSecure.patch(`/api/cart/${id}`, { quantity }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }) });
  const removeItem = useMutation({ mutationFn: (id) => axiosSecure.delete(`/api/cart/${id}`), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }) });
  const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0);
  const openCheckout = () => {
    setCheckoutError("");
    setCheckoutOpen(true);
  };
  const submitOrder = async (event) => {
    event.preventDefault();
    setIsSubmittingOrder(true);
    setCheckoutError("");
    const formData = new FormData(event.currentTarget);
    const order = {
      name: formData.get("name"),
      number: formData.get("number"),
      location: formData.get("location"),
      email: user?.email,
      items: cartItems,
      subtotal,
      deliveryFee: 80,
      total: subtotal + 80,
    };
    try {
      await axiosSecure.post("/api/orders", order);
      await Promise.all(cartItems.map((item) => axiosSecure.delete(`/api/cart/${item._id}`)));
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
      setCheckoutOpen(false);
    } catch (error) {
      setCheckoutError(error.response?.data?.message || "Could not place your order. Please try again.");
    } finally {
      setIsSubmittingOrder(false);
    }
  };
  return <><main className="page account-page"><PageHeader eyebrow="Your shopping bag" title={<>Ready to <em>checkout?</em></>} description="Review your selected pieces before placing your order." /><div className="split-layout"><Panel><div className="panel-title"><div><h2>Cart items</h2><p>{cartItems.length} item{cartItems.length === 1 ? "" : "s"} in your bag</p></div><ShoppingBag /></div>{isLoading && <p className="muted">Loading your cart...</p>}{isError && <p className="form-error">Could not load your cart.</p>}{!isLoading && !isError && cartItems.length === 0 && <div className="empty-state"><ShoppingBag size={35} /><h2>Your cart is empty</h2><Link className="btn btn-primary" to="/products">Browse products</Link></div>}{cartItems.map((item) => <div className="line-item" key={item._id}><img src={item.image} alt={item.name} /><div className="line-item-info"><h3>{item.name}</h3><p>{item.category}</p><strong>{money(Number(item.price) || 0)}</strong><div className="quantity"><button disabled={item.quantity <= 1} onClick={() => updateQuantity.mutate({ id: item._id, quantity: item.quantity - 1 })} aria-label="Decrease quantity"><Minus size={15} /></button><span>{item.quantity}</span><button onClick={() => updateQuantity.mutate({ id: item._id, quantity: item.quantity + 1 })} aria-label="Increase quantity"><Plus size={15} /></button></div></div><button className="delete-button" onClick={() => removeItem.mutate(item._id)} aria-label={`Remove ${item.name}`}><Trash2 size={17} /></button></div>)}</Panel><Panel className="order-summary"><h2>Order summary</h2><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div><span>Delivery</span><strong>৳80</strong></div><hr /><div className="summary-total"><span>Total</span><strong>{money(subtotal + 80)}</strong></div><button disabled={!cartItems.length} onClick={openCheckout} className="btn btn-primary full">Proceed to checkout</button></Panel></div></main>{checkoutOpen && <div className="checkout-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !isSubmittingOrder) setCheckoutOpen(false); }}><section className="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title"><div className="modal-header"><div><p className="eyebrow">Complete your order</p><h2 id="checkout-title">Delivery details</h2></div><button type="button" className="modal-close" onClick={() => setCheckoutOpen(false)} disabled={isSubmittingOrder} aria-label="Close checkout"><X size={20} /></button></div><form className="account-form" onSubmit={submitOrder}><label>Name<input name="name" required placeholder="Your full name" /></label><label>Phone number<input name="number" required type="tel" placeholder="+880 1XXX-XXXXXX" /></label><label>Delivery location<textarea name="location" required rows="3" placeholder="House, road, area, city" /></label>{checkoutError && <p className="form-error">{checkoutError}</p>}<button className="btn btn-primary full" type="submit" disabled={isSubmittingOrder}>{isSubmittingOrder ? "Placing order..." : `Confirm order · ${money(subtotal + 80)}`}</button></form></section></div>}</>;
}

export function ServerWishlistPage() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { data: wishlist = [], isLoading, isError } = useQuery({ queryKey: ["wishlist"], queryFn: async () => (await axiosSecure.get("/api/wishlist")).data });
  const removeWishlist = useMutation({ mutationFn: (id) => axiosSecure.delete(`/api/wishlist/${id}`), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }) });
  const addToCart = useMutation({ mutationFn: (product) => axiosSecure.post("/api/cart", { productId: product.productId, name: product.name, price: product.price, image: product.image, quantity: 1 }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }) });
  return <main className="page account-page"><PageHeader eyebrow="Saved for later" title={<>Your <em>wishlist.</em></>} description="Keep the pieces you love close by." />{isLoading && <p className="muted">Loading your wishlist...</p>}{isError && <p className="form-error">Could not load your wishlist.</p>}{!isLoading && !isError && wishlist.length === 0 && <div className="empty-state"><Heart size={35} /><h2>Your wishlist is empty</h2><Link className="btn btn-primary" to="/products">Find products</Link></div>}<div className="wishlist-grid">{wishlist.map((product) => <article className="wishlist-card" key={product._id}><img src={product.image} alt={product.name} /><div><p className="eyebrow">{product.category}</p><h3>{product.name}</h3><strong>{money(Number(product.price) || 0)}</strong><div><button className="btn btn-primary" onClick={() => addToCart.mutate(product)}>Add to cart</button><button className="delete-button" onClick={() => removeWishlist.mutate(product._id)} aria-label={`Remove ${product.name}`}><Trash2 size={16} /></button></div></div></article>)}</div></main>;
}

export function OrdersPage() {
  const axiosSecure = useAxiosSecure();
  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => (await axiosSecure.get("/api/orders")).data,
  });
  const getOrderStatus = (order) => {
    const statuses = order.items?.map((item) => item.status).filter(Boolean) || [];
    if (statuses.includes("Cancelled")) return "Cancelled";
    if (statuses.includes("Shipped")) return "Shipped";
    if (statuses.includes("Processing")) return "Processing";
    if (statuses.length && statuses.every((status) => status === "Delivered")) return "Delivered";
    return order.status || "Pending";
  };
  return <main className="page account-page"><PageHeader eyebrow="Your purchases" title={<>My <em>orders.</em></>} description="Track your orders and revisit your DeshiCart purchases." /><Panel><div className="panel-title"><div><h2>Order history</h2><p>{orders.length} orders placed</p></div><ShoppingBag /></div>{isLoading && <p className="muted">Loading your orders...</p>}{isError && <p className="form-error">Could not load your orders.</p>}{!isLoading && !isError && !orders.length && <div className="empty-state"><ShoppingBag size={35} /><h2>No orders yet</h2><Link className="btn btn-primary" to="/products">Start shopping</Link></div>}<div className="orders-table">{orders.flatMap((order) => (order.items || []).map((item, index) => { const status = item.status || getOrderStatus(order); return <div className="order-row" key={`${order._id}-${item.productId || index}`}><div><strong>#{String(order._id).slice(-8).toUpperCase()}</strong><span>{new Date(order.createdAt).toLocaleDateString()}</span></div><div className="order-product"><img src={item.image} alt="" /><span><strong>{item.name}</strong><small>{item.category || "Product"} · {item.quantity} × {money(Number(item.price) || 0)}</small></span></div><span className={`status ${status === "Delivered" ? "delivered" : "transit"}`}>{status}</span><span className="muted">{order.location}</span></div>; }))}</div></Panel></main>;
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
  const [imageFile, setImageFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");
  const imageHostKey = import.meta.env.VITE_image_host_key;

  const uploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImage("");
    setImageUploadError("");

    if (!imageHostKey) {
      setImageUploadError("Image hosting is not configured. Please contact support.");
      return;
    }

    setImageUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append("key", imageHostKey);
      uploadData.append("image", file);
      const response = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: uploadData,
      });
      const result = await response.json();
      if (!response.ok || !result.success || !result.data?.display_url) {
        throw new Error(result.error?.message || "Image upload failed");
      }
      setImage(result.data.display_url);
    } catch (uploadError) {
      setImageFile(null);
      setImageUploadError(uploadError.message || "Image upload failed. Please try again.");
    } finally {
      setImageUploading(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!image) {
      setImageUploadError("Please upload a product image before submitting.");
      return;
    }
    const data = new FormData(event.currentTarget);
    await createProduct({
      name: data.get("name"),
      category: data.get("category"),
      price: Number(data.get("price")),
      description: data.get("description"),
      image: image.trim(),
      sellerEmail: auth.currentUser?.email || "",
      status: "pending",
    });
    event.currentTarget.reset();
    setImage("");
    setImageFile(null);
    setImageUploadError("");
  };
  return <main className="page account-page"><PageHeader eyebrow="Shopkeeper workspace" title={<>Add a new <em>product.</em></>} description="Create a beautiful listing for your next fashion piece." /><Panel><form className="account-form" onSubmit={submit}><label>Product name<input name="name" placeholder="e.g. Handloom Cotton Saree" required /></label><div className="form-two-col"><label>Category<select name="category" defaultValue="Sarees"><option>Sarees</option><option>Womenswear</option><option>Menswear</option><option>Accessories</option></select></label><label>Price (৳)<input name="price" type="number" min="1" placeholder="1850" required /></label></div><label>Description<textarea name="description" rows="4" placeholder="Describe fabric, fit, colour and care instructions..." required /></label><label>Product image<input name="imageFile" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={uploadImage} required /></label>{imageFile && <p className="saved-hint">{imageUploading ? "Uploading image..." : image ? `${imageFile.name} uploaded successfully.` : imageFile.name}</p>}{imageUploadError && <p className="form-error">{imageUploadError}</p>}{isSuccess && <p className="success-message"><Check size={16} /> Product submitted for admin approval.</p>}{isError && <p className="form-error">{error?.response?.data?.message || "Could not submit product. Please try again."}</p>}<button disabled={isPending || imageUploading || !image} className="btn btn-primary" type="submit">{imageUploading ? "Uploading image..." : isPending ? "Submitting..." : "Submit for approval"}</button></form></Panel></main>;
}

export function AllProductsPage() {
  const { data: sellerProducts = [], isLoading, isError } = useSellerProducts();
  return <main className="page account-page"><PageHeader eyebrow="Shopkeeper workspace" title={<>All <em>products.</em></>} description="Review and manage the products in your shop." /><Panel><div className="panel-title"><div><h2>Product catalogue</h2><p>{sellerProducts.length} listings</p></div><Link className="btn btn-primary" to="/add-product">Add product</Link></div>{isLoading && <p className="muted">Loading your products...</p>}{isError && <p className="form-error">Could not load your products.</p>}{!isLoading && sellerProducts.length === 0 && <div className="empty-state"><ShoppingBag size={35} /><h2>No products yet</h2><p>Publish your first product to see it here.</p></div>}<div className="manage-list">{sellerProducts.map((product) => <div className="manage-row" key={product._id || product.id}><img src={product.image} alt="" /><div><strong>{product.name}</strong><span>{product.category} · {money(product.price)}</span></div><span className={`status ${product.status === "approved" ? "delivered" : "transit"}`}>{product.status || "Pending"}</span><button className="icon-action" aria-label={`Edit ${product.name}`}><Edit3 size={16} /></button></div>)}</div></Panel></main>;
}

export function ManageOrdersPage() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ["seller-orders"],
    queryFn: async () => (await axiosSecure.get("/api/orders")).data,
  });
  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => axiosSecure.patch(`/api/orders/${id}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["seller-orders"] }),
  });
  const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
  return <main className="page account-page"><PageHeader eyebrow="Shopkeeper workspace" title={<>Manage <em>orders.</em></>} description="Keep customers updated from payment to delivery." /><Panel><div className="panel-title"><div><h2>Recent orders</h2><p>Update status as orders move through fulfilment.</p></div><ShoppingBag /></div>{isLoading && <p className="muted">Loading orders...</p>}{isError && <p className="form-error">Could not load orders.</p>}{!isLoading && !isError && !orders.length && <div className="empty-state"><ShoppingBag size={35} /><h2>No orders for your products yet</h2></div>}<div className="manage-list">{orders.map((order) => order.items.map((item) => <div className="manage-row order-manage-row" key={`${order._id}-${item.productId}`}><div><strong>#{String(order._id).slice(-8).toUpperCase()} · {order.name}</strong><span>{item.name} × {item.quantity} · {money(Number(item.price) * Number(item.quantity))}</span></div><select defaultValue={item.status || "Pending"} aria-label={`Status for ${item.name}`} onChange={(event) => updateStatus.mutate({ id: order._id, status: event.target.value })} disabled={updateStatus.isPending}><option>{statuses[0]}</option>{statuses.slice(1).map((status) => <option key={status}>{status}</option>)}</select><span className={`status ${item.status === "Delivered" ? "delivered" : "transit"}`}>{item.status || "Pending"}</span></div>))}</div></Panel></main>;
}

const getCollection = (data) => {
  if (Array.isArray(data)) return data;
  const collection = data?.users || data?.products || data?.data;
  return Array.isArray(collection) ? collection : [];
};

export function AdminUsersPage() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const response = await axiosSecure.get("/api/users");
      return getCollection(response.data);
    },
  });
  const { mutate: updateRole, isPending: isUpdating, isError: isRoleUpdateError } = useMutation({
    mutationFn: ({ id, role }) => axiosSecure.patch(`/api/users/${id}/role`, { role }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  return <main className="page account-page"><PageHeader eyebrow="Admin workspace" title={<>All <em>users.</em></>} description="Review the customers and sellers registered on DeshiCart." /><Panel><div className="panel-title"><div><h2>User directory</h2><p>{users.length} registered users</p></div><Users /></div>{isLoading && <p className="muted">Loading users...</p>}{isError && <p className="form-error">Could not load users.</p>}{isRoleUpdateError && <p className="form-error">Could not update the user role.</p>}{!isLoading && users.length === 0 && <div className="empty-state"><Users size={35} /><h2>No users found</h2></div>}<div className="manage-list">{users.map((listedUser) => <div className="manage-row user-manage-row" key={listedUser._id || listedUser.uid || listedUser.email}><div><strong>{listedUser.name || listedUser.displayName || "Unnamed user"}</strong><span>{listedUser.email}</span></div><select value={listedUser.role || "customer"} onChange={(event) => updateRole({ id: listedUser._id, role: event.target.value })} disabled={isUpdating || !listedUser._id} aria-label={`Role for ${listedUser.email}`}><option value="customer">Customer</option><option value="seller">Seller</option><option value="admin">Admin</option></select><span className={`status ${listedUser.role === "admin" ? "delivered" : "transit"}`}>{listedUser.role || "customer"}</span></div>)}</div></Panel></main>;
}

export function AdminPendingProductsPage() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { mutate: updateStatus, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, status }) => axiosSecure.patch(`/api/products/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pending-products"] });
      queryClient.invalidateQueries({ queryKey: ["approved-products"] });
    },
  });
  const { data: pendingProducts = [], isLoading, isError } = useQuery({
    queryKey: ["admin-pending-products"],
    queryFn: async () => {
      const response = await axiosSecure.get("/api/products?status=pending");
      return getCollection(response.data);
    },
  });

  return <main className="page account-page"><PageHeader eyebrow="Admin workspace" title={<>Pending <em>products.</em></>} description="Review product listings waiting for approval before they appear in the shop." /><Panel><div className="panel-title"><div><h2>Approval queue</h2><p>{pendingProducts.length} products awaiting review</p></div><ClipboardCheck /></div>{isLoading && <p className="muted">Loading pending products...</p>}{isError && <p className="form-error">Could not load pending products.</p>}{!isLoading && pendingProducts.length === 0 && <div className="empty-state"><ClipboardCheck size={35} /><h2>Queue is clear</h2><p>There are no products waiting for approval.</p></div>}<div className="manage-list">{pendingProducts.map((product) => <div className="manage-row" key={product._id || product.id}><img src={product.image} alt="" /><div><strong>{product.name}</strong><span>{product.category} · {money(Number(product.price) || 0)}</span></div><span className="status transit">Pending</span><div className="admin-actions"><button className="btn btn-primary" disabled={isUpdating} onClick={() => updateStatus({ id: product._id, status: "approved" })}>Approve</button><button className="btn btn-outline" disabled={isUpdating} onClick={() => updateStatus({ id: product._id, status: "rejected" })}>Reject</button></div></div>)}</div></Panel></main>;
}

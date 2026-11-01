import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="site-footer">
    <div className="container">
      <div>
        <Link className="footer-brand" to="/" aria-label="DeshiCart home"><img src="/DeshiCartLogo.png" alt="DeshiCart" /></Link>
        <p>Thoughtfully made products from local makers, delivered to your door.</p>
      </div>
      <div><h3>Explore</h3><ul><li><Link to="/">Home</Link></li><li><Link to="/products">Shop products</Link></li><li><Link to="/about">Our story</Link></li><li><Link to="/contact">Contact</Link></li></ul></div>
      <div><h3>Customer care</h3><ul><li><Link to="/contact">Help centre</Link></li><li><Link to="/contact">Shipping & returns</Link></li><li><Link to="/contact">Privacy policy</Link></li></ul></div>
      <div><h3>Stay in the know</h3><p>Get maker stories and new product updates.</p><form className="newsletter" onSubmit={(event) => event.preventDefault()}><input type="email" placeholder="Your email" aria-label="Email address" required /><button type="submit">Join</button></form></div>
      <p className="footer-bottom">© {new Date().getFullYear()} DeshiCart. Made with care in Bangladesh.</p>
    </div>
  </footer>
);

export default Footer;

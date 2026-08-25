import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <h3 className="footer-section-title">ShopEasy</h3>
            <p className="footer-text">
              Your one-stop shop for quality products at great prices.
            </p>
          </div>
          <div className="footer-section">
            <h3 className="footer-section-title">Quick Links</h3>
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/cart" className="footer-link">Cart</Link>
            <Link to="/checkout" className="footer-link">Checkout</Link>
          </div>
          <div className="footer-section">
            <h3 className="footer-section-title">Contact</h3>
            <p className="footer-text">Email: support@shopeasy.com</p>
            <p className="footer-text">Phone: (555) 123-4567</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ShopEasy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

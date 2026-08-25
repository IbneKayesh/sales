import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { CartIcon, SearchIcon } from '@/icons';

const Header = () => {
  const { getCartItemCount } = useCart();
  const cartCount = getCartItemCount();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <CartIcon size={22} /> ShopEasy
        </Link>

        <form className="header-search" onSubmit={handleSearch}>
          <input
            type="text"
            className="header-search-input"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search products"
          />
          <button type="submit" className="header-search-btn" aria-label="Search">
            <SearchIcon size={16} />
          </button>
        </form>

        <div className="header-right">
          <Link to="/cart" className="header-cart" aria-label={`Shopping cart with ${cartCount} items`}>
            <CartIcon size={18} />
            {cartCount > 0 && (
              <span className="header-cart-count" aria-hidden="true">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;

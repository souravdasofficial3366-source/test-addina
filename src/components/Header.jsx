import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHeart, FiSearch, FiX, FiTrash2 } from 'react-icons/fi';
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import { FaFacebookF, FaTwitter, FaYoutube, FaLinkedinIn } from 'react-icons/fa';
import { MdOutlineLocationOn, MdOutlinePhone, MdOutlineEmail } from 'react-icons/md';
import { useCart } from '../context/CartContext';
import './Header.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { cartItems, cartCount, wishlistItems, wishlistCount, removeFromCart, updateQuantity, toggleWishlist } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setCartOpen(false);
    setWishlistOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = (menuOpen || cartOpen || wishlistOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, cartOpen, wishlistOpen]);

  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <>
      <header className={`header ${scrolled ? 'header--scrolled' : ''}`} id="main-header">
        <div className="container header__inner">
          <div className="header__left-actions mobile-only-flex">
            <button
              className="header__icon-btn search-icon-mobile"
              onClick={() => { /* Toggle mobile search logic if needed, or focus */ }}
              aria-label="Search"
            >
              <FiSearch />
            </button>
            <button
              className={`header__hamburger ${menuOpen ? 'active' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              id="menu-toggle"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>

          <Link to="/" className="header__logo" id="logo-link">
            <svg className="header__logo-icon" viewBox="0 0 40 40" width="32" height="32">
              <circle cx="20" cy="12" r="8" fill="var(--clr-primary)" opacity="0.8"/>
              <path d="M8 38 Q10 20 20 22 Q30 20 32 38" stroke="var(--clr-primary)" strokeWidth="3" fill="none"/>
              <line x1="12" y1="38" x2="12" y2="30" stroke="var(--clr-primary)" strokeWidth="2.5"/>
              <line x1="28" y1="38" x2="28" y2="30" stroke="var(--clr-primary)" strokeWidth="2.5"/>
            </svg>
            <span className="header__logo-text">ADDINA</span>
          </Link>

          <div className="header__actions">
            <form className="header__search-form desktop-only-flex" onSubmit={handleSearch}>
              <input 
                type="text" 
                placeholder="Search products..." 
                className="header__search-input" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" aria-label="Search" className="header__search-submit">
                <FiSearch />
              </button>
            </form>
            <button 
              className="header__icon-btn desktop-only-flex" 
              id="wishlist-btn" 
              aria-label="Wishlist"
              onClick={() => setWishlistOpen(true)}
            >
              <FiHeart />
              {wishlistCount > 0 && <span className="header__badge">{wishlistCount}</span>}
            </button>
            <button 
              className="header__icon-btn" 
              id="cart-btn" 
              aria-label="Cart"
              onClick={() => setCartOpen(true)}
            >
              <HiOutlineShoppingBag />
              {cartCount > 0 && <span className="header__badge">{cartCount}</span>}
            </button>
            <button
              className={`header__hamburger desktop-only-flex ${menuOpen ? 'active' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Sticky Mobile Wishlist Pop-up */}
      <button 
        className="mobile-wishlist-popup mobile-only-flex" 
        onClick={() => setWishlistOpen(true)}
      >
        ❤️
        {wishlistCount > 0 && <span className="mobile-wishlist-badge">{wishlistCount}</span>}
      </button>

      {/* Sidebar Menu Overlay */}
      <div 
        className={`sidebar-overlay ${(menuOpen || cartOpen || wishlistOpen) ? 'active' : ''}`} 
        onClick={() => { setMenuOpen(false); setCartOpen(false); setWishlistOpen(false); }} 
      />

      {/* Sidebar Menu */}
      <aside className={`sidebar ${menuOpen ? 'active' : ''}`} id="sidebar-menu">
        <div className="sidebar__header">
          <Link to="/" className="header__logo sidebar__logo">
            <svg className="header__logo-icon" viewBox="0 0 40 40" width="28" height="28">
              <circle cx="20" cy="12" r="8" fill="var(--clr-primary)" opacity="0.8"/>
              <path d="M8 38 Q10 20 20 22 Q30 20 32 38" stroke="var(--clr-primary)" strokeWidth="3" fill="none"/>
              <line x1="12" y1="38" x2="12" y2="30" stroke="var(--clr-primary)" strokeWidth="2.5"/>
              <line x1="28" y1="38" x2="28" y2="30" stroke="var(--clr-primary)" strokeWidth="2.5"/>
            </svg>
            <span className="header__logo-text">ADDINA</span>
          </Link>
          <button className="sidebar__close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <FiX />
          </button>
        </div>

        <div className="sidebar__search">
          <input type="text" placeholder="What are you searching for?" id="sidebar-search" />
          <FiSearch className="sidebar__search-icon" />
        </div>

        <nav className="sidebar__nav">
          <Link to="/" className="sidebar__nav-link">Home</Link>
          <Link to="/about" className="sidebar__nav-link">About</Link>
          <Link to="/shop" className="sidebar__nav-link">Shop</Link>
          <Link to="/shop" className="sidebar__nav-link">Pages</Link>
          <Link to="/shop" className="sidebar__nav-link">Blog</Link>
          <Link to="/contact" className="sidebar__nav-link">Contact</Link>
        </nav>

        <div className="sidebar__contact">
          <h4 className="sidebar__contact-title">Contact Info</h4>
          <div className="sidebar__contact-item">
            <MdOutlineLocationOn />
            <span>12/A, Mirnada City Tower, NYC</span>
          </div>
          <div className="sidebar__contact-item">
            <MdOutlinePhone />
            <span>+088889797697</span>
          </div>
          <div className="sidebar__contact-item">
            <MdOutlineEmail />
            <span>support@mail.com</span>
          </div>
        </div>

        <div className="sidebar__social">
          <a href="#" aria-label="Facebook"><FaFacebookF /></a>
          <a href="#" aria-label="Twitter"><FaTwitter /></a>
          <a href="#" aria-label="YouTube"><FaYoutube /></a>
          <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
        </div>
      </aside>

      {/* Cart Drawer */}
      <aside className={`cart-drawer ${cartOpen ? 'active' : ''}`} id="cart-drawer">
        <div className="cart-drawer__header">
          <h4 className="cart-drawer__title">Shopping Cart ({cartCount})</h4>
          <button className="cart-drawer__close" onClick={() => setCartOpen(false)} aria-label="Close cart">
            <FiX />
          </button>
        </div>

        <div className="cart-drawer__body">
          {cartItems.length === 0 ? (
            <div className="cart-drawer__empty">
              <HiOutlineShoppingBag className="cart-drawer__empty-icon" />
              <p>Your cart is currently empty.</p>
              <Link to="/shop" className="btn btn--primary" onClick={() => setCartOpen(false)}>
                RETURN TO SHOP
              </Link>
            </div>
          ) : (
            <ul className="cart-drawer__items">
              {cartItems.map((item) => (
                <li className="cart-item" key={item.id}>
                  <Link to={`/product/${item.id}`} onClick={() => setCartOpen(false)}>
                    <img src={item.image} alt={item.name} className="cart-item__image" />
                  </Link>
                  <div className="cart-item__info">
                    <Link to={`/product/${item.id}`} className="cart-item__name" onClick={() => setCartOpen(false)}>
                      {item.name}
                    </Link>
                    <div className="cart-item__price">${item.price.toFixed(2)}</div>
                    <div className="cart-item__qty-wrap">
                      <div className="cart-item__qty">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                      <button 
                        className="cart-item__remove" 
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__subtotal">
              <span>Subtotal:</span>
              <span className="cart-drawer__subtotal-price">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="cart-drawer__actions">
              <Link to="/cart" className="btn btn--outline cart-drawer__btn" onClick={() => setCartOpen(false)}>VIEW CART</Link>
              <Link to="/checkout" className="btn btn--primary cart-drawer__btn" onClick={() => setCartOpen(false)}>CHECKOUT</Link>
            </div>
          </div>
        )}
      </aside>

      {/* Wishlist Drawer */}
      <aside className={`cart-drawer wishlist-drawer ${wishlistOpen ? 'active' : ''}`} id="wishlist-drawer">
        <div className="cart-drawer__header">
          <h4 className="cart-drawer__title">My Wishlist ({wishlistCount})</h4>
          <button className="cart-drawer__close" onClick={() => setWishlistOpen(false)} aria-label="Close wishlist">
            <FiX />
          </button>
        </div>

        <div className="cart-drawer__body">
          {wishlistItems && wishlistItems.length === 0 ? (
            <div className="cart-drawer__empty">
              <FiHeart className="cart-drawer__empty-icon" />
              <p>Your wishlist is currently empty.</p>
              <Link to="/shop" className="btn btn--primary" onClick={() => setWishlistOpen(false)}>
                EXPLORE PRODUCTS
              </Link>
            </div>
          ) : (
            <ul className="cart-drawer__items">
              {wishlistItems && wishlistItems.map((item) => (
                <li className="cart-item" key={`wishlist-${item.id}`}>
                  <Link to={`/product/${item.id}`} onClick={() => setWishlistOpen(false)}>
                    <img src={item.image} alt={item.name} className="cart-item__image" />
                  </Link>
                  <div className="cart-item__info">
                    <Link to={`/product/${item.id}`} className="cart-item__name" onClick={() => setWishlistOpen(false)}>
                      {item.name}
                    </Link>
                    <div className="cart-item__price">${item.price.toFixed(2)}</div>
                    <div className="cart-item__qty-wrap">
                      <button 
                        className="btn btn--outline" 
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                        onClick={() => toggleWishlist(item)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}

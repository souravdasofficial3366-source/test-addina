import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaYoutube, FaLinkedinIn } from 'react-icons/fa';
import { MdOutlineLocationOn, MdOutlinePhone, MdOutlineEmail } from 'react-icons/md';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" id="main-footer">
      <div className="container">
        <div className="footer__grid">
          {/* About Column */}
          <div className="footer__col">
            <div className="footer__logo">
              <svg viewBox="0 0 40 40" width="28" height="28">
                <circle cx="20" cy="12" r="8" fill="var(--clr-primary)" opacity="0.8"/>
                <path d="M8 38 Q10 20 20 22 Q30 20 32 38" stroke="var(--clr-primary)" strokeWidth="3" fill="none"/>
                <line x1="12" y1="38" x2="12" y2="30" stroke="var(--clr-primary)" strokeWidth="2.5"/>
                <line x1="28" y1="38" x2="28" y2="30" stroke="var(--clr-primary)" strokeWidth="2.5"/>
              </svg>
              <span>ADDINA</span>
            </div>
            <p className="footer__text">
              We create furniture that combines timeless design with modern comfort. Every piece is crafted with care to transform your living spaces.
            </p>
            <div className="footer__social">
              <a href="#" aria-label="Facebook"><FaFacebookF /></a>
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" aria-label="YouTube"><FaYoutube /></a>
              <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
            </div>
          </div>

          {/* Contact Column */}
          <div className="footer__col">
            <h4 className="footer__heading">Contact Us</h4>
            <div className="footer__contact-item">
              <MdOutlineLocationOn />
              <span>12/A, Mirnada City Tower, NYC</span>
            </div>
            <div className="footer__contact-item">
              <MdOutlinePhone />
              <span>+088889797697</span>
            </div>
            <div className="footer__contact-item">
              <MdOutlineEmail />
              <span>support@mail.com</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__col">
            <h4 className="footer__heading">Quick Links</h4>
            <ul className="footer__links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/shop">Shop</Link></li>
              <li><Link to="/blog/1">Blog</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/admin" style={{ color: 'var(--clr-primary)', fontWeight: '600' }}>Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer__col">
            <h4 className="footer__heading">Categories</h4>
            <ul className="footer__links">
              <li><Link to="/shop?search=living">Living Room</Link></li>
              <li><Link to="/shop?search=bedroom">Bedroom</Link></li>
              <li><Link to="/shop?search=dining">Dining Room</Link></li>
              <li><Link to="/shop?search=office">Office</Link></li>
              <li><Link to="/shop?search=outdoor">Outdoor</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} Addina. All rights reserved.</p>
          <div className="footer__payments">
            <span className="payment-icon">VISA</span>
            <span className="payment-icon">MC</span>
            <span className="payment-icon">AMEX</span>
            <span className="payment-icon">PP</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Link } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiEye } from 'react-icons/fi';
import StarRating from './StarRating';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const wishlisted = isInWishlist(product.id);

  return (
    <div className="product-card" id={`product-card-${product.id}`}>
      <div className="product-card__image-wrap">
        <Link to={`/product/${product.id}`}>
          <img src={product.image} alt={product.name} className="product-card__image" loading="lazy" />
        </Link>
        {product.badge && (
          <span className={`product-card__badge product-card__badge--${product.badgeType}`}>
            {product.badge}
          </span>
        )}
        <div className="product-card__actions">
          <button
            className="product-card__action-btn"
            onClick={() => addToCart(product)}
            aria-label="Add to cart"
          >
            <FiShoppingBag />
          </button>
          <Link to={`/product/${product.id}`} className="product-card__action-btn" aria-label="Quick view">
            <FiEye />
          </Link>
          <button
            className={`product-card__action-btn ${wishlisted ? 'active' : ''}`}
            onClick={() => toggleWishlist(product)}
            aria-label="Add to wishlist"
          >
            <FiHeart />
          </button>
        </div>
      </div>
      <div className="product-card__info">
        <Link to={`/product/${product.id}`} className="product-card__name">{product.name}</Link>
        <StarRating rating={product.rating} />
        <p className="product-card__price">
          {product.originalPrice && (
            <span className="product-card__price-old">USD {product.originalPrice.toFixed(2)}</span>
          )}
          USD {product.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
}

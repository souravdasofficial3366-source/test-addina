import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiHeart, FiMinus, FiPlus } from 'react-icons/fi';
import { FaFacebookF, FaTwitter, FaBehance, FaYoutube, FaLinkedinIn, FaShoppingBag } from 'react-icons/fa';
import PageBanner from '../components/PageBanner';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import './ProductDetails.css';

export default function ProductDetails() {
  const { id } = useParams();
  const product = products.find(p => p.id === Number(id)) || products[0];
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 4);
  const wishlisted = isInWishlist(product.id);

  return (
    <main className="product-details-page" id="product-details-page">
      <PageBanner title="Product Details" breadcrumbs={['Home', 'Product Details']} />

      <section className="pd section">
        <div className="container">
          <div className="pd__grid">
            {/* Gallery */}
            <div className="pd__gallery">
              <div className="pd__thumbnails">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className={`pd__thumb ${i === activeImage ? 'active' : ''}`}
                    onClick={() => setActiveImage(i)}
                  >
                    <img src={img} alt={`${product.name} view ${i + 1}`} />
                  </button>
                ))}
              </div>
              <div className="pd__main-image">
                <img src={product.images[activeImage]} alt={product.name} />
              </div>
            </div>

            {/* Info */}
            <div className="pd__info">
              <span className="pd__category-badge">{product.category}</span>
              <div className="pd__rating-row">
                <StarRating rating={product.rating} />
                <span className="pd__reviews">{product.reviews} Reviews</span>
              </div>
              <h2 className="pd__name">{product.name}</h2>
              <div className="pd__price">
                {product.originalPrice && (
                  <span className="pd__price-old">${product.originalPrice.toFixed(2)}</span>
                )}
                <span className="pd__price-current">${product.price.toFixed(2)}</span>
              </div>
              <p className="pd__description">{product.description}</p>

              <div className="pd__actions">
                <div className="pd__quantity">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity"><FiMinus /></button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity"><FiPlus /></button>
                </div>
                <button className="btn btn--primary pd__add-cart" onClick={() => addToCart(product, quantity)} id="add-to-cart">
                  ADD TO CART <FaShoppingBag />
                </button>
                <button
                  className={`pd__wishlist-btn ${wishlisted ? 'active' : ''}`}
                  onClick={() => toggleWishlist(product)}
                  aria-label="Add to wishlist"
                >
                  <FiHeart />
                </button>
              </div>

              <div className="pd__meta">
                <p><strong>SKU:</strong> {product.sku}</p>
                <p><strong>Categories:</strong> {typeof product.category === 'string' ? product.category : product.category}</p>
                <p><strong>Tags:</strong> {product.tags.join(', ')}</p>
              </div>

              <div className="pd__share">
                <span><strong>Share:</strong></span>
                <div className="pd__share-icons">
                  <a href="#" aria-label="Facebook"><FaFacebookF /></a>
                  <a href="#" aria-label="Twitter"><FaTwitter /></a>
                  <a href="#" aria-label="Behance"><FaBehance /></a>
                  <a href="#" aria-label="YouTube"><FaYoutube /></a>
                  <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="pd__tabs">
            <div className="pd__tab-header">
              <button
                className={`pd__tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                DESCRIPTION
              </button>
              <button
                className={`pd__tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                REVIEWS ({product.reviews})
              </button>
            </div>
            <div className="pd__tab-content">
              {activeTab === 'description' ? (
                <div>
                  <p>{product.description}</p>
                  <p>Our furniture is crafted with the finest materials, ensuring durability and lasting beauty. Each piece undergoes rigorous quality checks to meet our high standards. We take pride in combining traditional craftsmanship with modern design sensibilities.</p>
                </div>
              ) : (
                <div>
                  <p>No reviews yet. Be the first to review this product!</p>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          <div className="pd__related">
            <h3 className="pd__related-title">Related Products</h3>
            <div className="pd__related-grid">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

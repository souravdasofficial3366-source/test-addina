import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiTruck, FiRotateCcw, FiHeadphones, FiShield, FiChevronLeft, FiChevronRight, FiPlay } from 'react-icons/fi';
import { FaQuoteRight } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import StarRating from '../components/StarRating';
import { heroData, promoBanners, services, blogPosts, testimonials } from '../data/products';
import { useProducts } from '../hooks/useProducts';
import roomLifestyle from '../assets/images/room-lifestyle.png';
import blogInterior from '../assets/images/blog-interior.png';
import leatherChair from '../assets/images/leather-chair.png';
import woodenChair from '../assets/images/wooden-chair.png';
import './Home.css';

const serviceIcons = {
  truck: <FiTruck />,
  money: <FiRotateCcw />,
  support: <FiHeadphones />,
  shield: <FiShield />,
};

export default function Home() {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState('All Collection');
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0);

  const { products, loading } = useProducts();

  const featuredProducts = products.slice(0, 6);
  const trendyProducts = products.slice(0, 8);
  const filters = ['All Collection', 'New In', 'Top Rated', 'Tensing Items'];

  const heroSlides = [
    heroData,
    { badge: 'HOT DEAL', title: 'Elegant Leather Chair', description: 'Experience the premium quality and a refined look in your space.', image: leatherChair }, 
    { badge: 'DISCOUNT', title: 'Minimalist Wooden Chair', description: 'Classic aesthetic for your everyday home style.', image: woodenChair } 
  ];

  const filteredProducts = activeFilter === 'All Collection'
    ? trendyProducts
    : activeFilter === 'New In'
    ? trendyProducts.filter(p => p.badge?.toUpperCase() === 'NEW' || p.badge_type === 'new')
    : activeFilter === 'Top Rated'
    ? trendyProducts.filter(p => p.rating > 0)
    : trendyProducts.slice(0, 4);

  const displayProducts = filteredProducts.length > 0 ? filteredProducts : trendyProducts;

  const nextFeatured = () => setFeaturedIndex((i) => (i + 1) % featuredProducts.length);
  const prevFeatured = () => setFeaturedIndex((i) => (i - 1 + featuredProducts.length) % featuredProducts.length);

  const nextTestimonial = () => setTestimonialIndex((i) => (i + 1) % testimonials.length);

  const handleCardClick = (idx) => {
    if (idx === 0) prevFeatured();
    if (idx === 2) nextFeatured();
  };

  let touchStartX = useRef(0);
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };
  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    if (touchStartX.current - touchEndX > 30) {
      nextFeatured();
    } else if (touchEndX - touchStartX.current > 30) {
      prevFeatured();
    }
  };

  let wheelTimeout = useRef(null);
  const handleFeaturedWheel = (e) => {
    if (wheelTimeout.current) return;
    if (e.deltaY > 20 || e.deltaX > 20) {
      nextFeatured();
      wheelTimeout.current = setTimeout(() => { wheelTimeout.current = null; }, 500);
    } else if (e.deltaY < -20 || e.deltaX < -20) {
      prevFeatured();
      wheelTimeout.current = setTimeout(() => { wheelTimeout.current = null; }, 500);
    }
  };

  useEffect(() => {
    const testInt = setInterval(() => {
      setTestimonialIndex((i) => (i + 1) % testimonials.length);
    }, 3000);
    const heroInt = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroSlides.length);
    }, 5000);
    const featInt = setInterval(() => {
      setFeaturedIndex((i) => (i + 1) % featuredProducts.length);
    }, 5000);
    return () => {
      clearInterval(testInt);
      clearInterval(heroInt);
      clearInterval(featInt);
    };
  }, [featuredProducts.length, heroSlides.length]);

  const currentHero = heroSlides[heroIndex];

  return (
    <main className="home" id="home-page">
      {/* ===== HERO SECTION ===== */}
      <section className="hero" id="hero-section">
        <div className="container hero__inner">
          <div className="hero__content" key={`text-${heroIndex}`}>
            <span className="hero__badge">{currentHero?.badge}</span>
            <h1 className="hero__title">{currentHero?.title}</h1>
            <p className="hero__desc">{currentHero?.description}</p>
            <div className="hero__buttons">
              <Link to="/shop" className="btn btn--primary">BUY NOW</Link>
              <Link to="/shop" className="btn btn--outline">VIEW DETAILS</Link>
            </div>
          </div>
          <div className="hero__image" key={`img-${heroIndex}`}>
            <img src={currentHero?.image} alt="Featured furniture" />
          </div>
        </div>
        
        <div className="hero-nav">
          {heroSlides.map((_, idx) => (
            <button 
              key={idx}
              className={`hero-nav__dot ${idx === heroIndex ? 'active' : ''}`}
              onClick={() => setHeroIndex(idx)}
              aria-label={`Go to hero slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="services section" id="services-section">
        <div className="container">
          <div className="services__grid">
            {services.map((svc) => (
              <div className="service-card" key={svc.id}>
                <div className="service-card__icon">{serviceIcons[svc.icon]}</div>
                <div>
                  <h5 className="service-card__title">{svc.title}</h5>
                  <p className="service-card__desc">{svc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROMO BANNERS ===== */}
      <section className="promo section" id="promo-section">
        <div className="container">
          <div className="promo__grid">
            {promoBanners.map((banner) => (
              <div 
                className="promo-card" 
                key={banner.id} 
                style={{ 
                  background: banner.bgColor, 
                  backgroundImage: `url(${banner.image})`,
                  backgroundPosition: 'right center',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                <div className="promo-card__content">
                  <span className="promo-card__subtitle">{banner.subtitle}</span>
                  <h3 className="promo-card__title">{banner.title}</h3>
                  <Link to="/shop" className="btn btn--primary">BUY NOW <FiChevronRight /></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="featured section section--grey" id="featured-section" style={{ overflowX: 'hidden' }}>
        <div className="container" style={{ marginBottom: '50px' }}>
          <div className="text-center">
            <span className="section-badge">TOP SALE</span>
            <h2 className="section-title">Featured Product</h2>
          </div>
        </div>
        <div 
          className="sprinklr-slider-container" 
          onWheel={handleFeaturedWheel} 
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: 'pan-y' }}
        >
          {loading && products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading products...</div>
          ) : (
            <div className="sprinklr-cards">
              {[...featuredProducts.slice(featuredIndex), ...featuredProducts.slice(0, featuredIndex)].slice(0, 3).map((product, idx) => (
                <div key={product.id} className={`sprinklr-card ${idx === 1 ? 'sprinklr-card--center' : ''}`} onClick={() => handleCardClick(idx)}>
                  <div className="sprinklr-card__header">
                    <span className="sprinklr-card__badge">{product.badge || 'FEATURED'}</span>
                    <h4 className="sprinklr-card__title">{product.name}</h4>
                  </div>
                  <div className="sprinklr-card__image-container">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <Link to={`/product/${product.id}`} className="sprinklr-card__explore" onClick={(e) => { if(idx !== 1) e.preventDefault(); }}>
                    <FiChevronRight className="sprinklr-card__explore-icon" /> Explore
                  </Link>
                </div>
              ))}
            </div>
          )}
          <div className="sprinklr-slider-indicators">
            {featuredProducts.map((_, i) => (
              <button 
                key={i} 
                className={`sprinklr-indicator ${i === featuredIndex ? 'active' : ''}`}
                onClick={() => setFeaturedIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOT DEAL / ROOM LIFESTYLE COMBINED ===== */}
      <section className="hot-deal-room section" id="hot-deal-section" style={{ padding: 0, maxWidth: '100vw', overflowX: 'hidden' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', background: 'var(--clr-primary)' }}>
          <div style={{ flex: '1 1 40%', minWidth: '350px' }}>
            <div style={{ paddingLeft: 'max(15px, calc((100vw - 1350px) / 2 + 15px))', paddingRight: '40px', paddingTop: '100px', paddingBottom: '100px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span className="hot-deal__subtitle">HOT DEAL FURNITURE</span>
              <h2 className="hot-deal__title">Live Furniture<br/>Your Love</h2>
              <Link to="/shop" className="btn btn--white" style={{ alignSelf: 'flex-start' }}>BUY NOW <FiChevronRight /></Link>
            </div>
          </div>
          
          <div style={{ flex: '1 1 60%', minWidth: '400px', position: 'relative' }}>
            <img src={roomLifestyle} alt="Living room setup" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            
            {/* Bookshelf Hotspot */}
            <div className="room-section__hotspot" style={{ top: '25%', left: '46%' }}>
              <span className="room-section__dot" />
              <div className="room-section__tooltip">
                <h5>Bookshelf</h5>
                <StarRating rating={4.5} size={12} />
                <p className="room-section__tooltip-price">USD 340.00</p>
              </div>
            </div>

            {/* Sofa Hotspot */}
            <div className="room-section__hotspot" style={{ top: '55%', left: '33%' }}>
              <span className="room-section__dot" />
              <div className="room-section__tooltip">
                <h5>Modern Sofa</h5>
                <StarRating rating={5} size={12} />
                <p className="room-section__tooltip-price">USD 899.00</p>
              </div>
            </div>

            {/* Modern Chair Hotspot */}
            <div className="room-section__hotspot" style={{ top: '75%', left: '68%' }}>
              <span className="room-section__dot" />
              <div className="room-section__tooltip">
                <h5>Modern Chair</h5>
                <StarRating rating={4} size={12} />
                <p className="room-section__tooltip-price">USD 120.00</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRENDY COLLECTION ===== */}
      <section className="trendy section" id="trendy-section">
        <div className="container">
          <span className="section-badge">THIS MONTH</span>
          <h2 className="section-title">Trendy Collection</h2>
          <div className="trendy__filters">
            {filters.map((f) => (
              <button
                key={f}
                className={`trendy__filter-btn ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="trendy__grid">
            {loading && products.length === 0 ? (
               <div style={{ textAlign: 'center', padding: '40px', gridColumn: '1 / -1' }}>Loading products...</div>
            ) : (
              displayProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* ===== VIDEO + TESTIMONIALS ===== */}
      <section className="vt-section section section--grey" id="video-testimonials">
        <div className="container">
          <div className="vt-section__grid">
            <div className="vt-section__video">
              <img src={blogInterior} alt="Furniture showcase" className="vt-section__video-img" />
              <button className="vt-section__play-btn" aria-label="Play video">
                <FiPlay />
              </button>
            </div>
            <div className="vt-section__testimonial">
              <FaQuoteRight className="vt-section__quote-icon" />
              <p className="vt-section__testimonial-text">{testimonials[testimonialIndex].text}</p>
              <div className="vt-section__testimonial-author">
                <h5>{testimonials[testimonialIndex].name}</h5>
                <span>{testimonials[testimonialIndex].role}</span>
              </div>
              <StarRating rating={testimonials[testimonialIndex].rating} />
              <div className="vt-section__testimonial-dots">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    className={`vt-section__dot ${i === testimonialIndex ? 'active' : ''}`}
                    onClick={() => setTestimonialIndex(i)}
                    aria-label={`Testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BLOG ===== */}
      <section className="blog section" id="blog-section">
        <div className="container">
          <div className="text-center">
            <span className="section-subtitle">OUR BLOG</span>
            <h2 className="section-title">Latest News & Articles</h2>
          </div>
          <div className="blog__grid">
            {blogPosts.map((post) => (
              <article className="blog-card" key={post.id}>
                <Link to="/blog/1" className="blog-card__image-link">
                  <div className="blog-card__image-wrap">
                    <img src={blogInterior} alt={post.title} className="blog-card__image" />
                    <div className="blog-card__date">
                      <span className="blog-card__day">{post.day}</span>
                      <span className="blog-card__month">{post.month}</span>
                    </div>
                  </div>
                </Link>
                <div className="blog-card__content">
                  <Link to="/blog/1" className="blog-card__title-link">
                    <h4 className="blog-card__title">{post.title}</h4>
                  </Link>
                  <p className="blog-card__excerpt">{post.excerpt}</p>
                  <Link to="/blog/1" className="blog-card__link">Continue Reading →</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="newsletter section section--light" id="newsletter-section">
        <div className="container text-center">
          <span className="section-subtitle">NEWSLETTER</span>
          <h2 className="section-title">Subscribe To Our Newsletter</h2>
          <p className="newsletter__desc">Get the latest updates on new arrivals and exclusive offers.</p>
          <form className="newsletter__form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email address" className="newsletter__input" id="newsletter-email" />
            <button type="submit" className="btn btn--primary">SUBSCRIBE</button>
          </form>
        </div>
      </section>
    </main>
  );
}

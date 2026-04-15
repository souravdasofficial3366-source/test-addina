import './PageBanner.css';
import bannerBg from '../assets/images/banner-bg.png';

export default function PageBanner({ title, breadcrumbs }) {
  return (
    <section className="page-banner" id="page-banner" style={{ backgroundImage: `url(${bannerBg})` }}>
      <div className="page-banner__overlay" />
      <div className="container page-banner__content">
        <h1 className="page-banner__title">{title}</h1>
        <div className="page-banner__breadcrumbs">
          {breadcrumbs.map((crumb, i) => (
            <span key={i}>
              {i > 0 && <span className="page-banner__separator"> • </span>}
              <span className={i === breadcrumbs.length - 1 ? 'active' : ''}>{crumb}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef } from 'react';
import { FiPlay } from 'react-icons/fi';
import PageBanner from '../components/PageBanner';
import roomLifestyle from '../assets/images/room-lifestyle.png';
import blogInterior from '../assets/images/blog-interior.png';
import './About.css';

const skills = [
  { name: 'Furniture', percent: 70 },
  { name: 'Handmade', percent: 52 },
  { name: 'Crafts', percent: 80 },
];

export default function About() {
  const barsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.width = entry.target.dataset.width;
          }
        });
      },
      { threshold: 0.5 }
    );

    barsRef.current.forEach(bar => {
      if (bar) observer.observe(bar);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="about-page" id="about-page">
      <PageBanner title="About us" breadcrumbs={['Home', 'About Us']} />

      <section className="about section">
        <div className="container about-container">
          <div className="about__content">
            <span className="section-subtitle">WE DESIGN FURNITURE</span>
            <h2 className="section-title">Our Core Divisions</h2>
            <p className="about__desc">
              Ut leo. Vivamus aliquet elit ac nisl. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac enim. Sed cursus turpis vitae tortor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce id purus. Sed sagittis. Curabitur suscipit suscipit.
            </p>

            <div className="about__skills" style={{ marginBottom: 'auto' }}>
              {skills.map((skill, i) => (
                <div className="about__skill" key={skill.name}>
                  <div className="about__skill-header">
                    <span className="about__skill-name">{skill.name}</span>
                    <span className="about__skill-percent">{skill.percent}%</span>
                  </div>
                  <div className="about__skill-track">
                    <div
                      className="about__skill-fill"
                      ref={el => barsRef.current[i] = el}
                      data-width={`${skill.percent}%`}
                      style={{ width: 0 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="about__inline-image">
              <img src={roomLifestyle} alt="Deep Interior" className="about__inline-img" />
            </div>
          </div>
          
          <div className="about__image-right">
            <img src={blogInterior} alt="Our Core Divisions" className="about__right-img" />
          </div>
        </div>
      </section>

      {/* Video Placeholder Section */}
      <section className="about-video section" style={{ paddingTop: '20px' }}>
        <div className="container">
          <div className="about__video" style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '500px' }}>
            <img src={blogInterior} alt="Video Placeholder" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button aria-label="Play video" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90px', height: '90px', borderRadius: '50%', border: 'none', background: 'var(--clr-primary)', color: '#fff', fontSize: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', transition: 'var(--transition)' }}>
              <FiPlay />
            </button>
          </div>
        </div>
      </section>

      <section className="about-features section section--grey">
        <div className="container">
          <div className="about-features__grid">
            <div className="about-feature" style={{ background: '#fff', padding: '40px', borderRadius: 'var(--radius-md)', textAlign: 'center', boxShadow: 'var(--shadow-card)' }}>
              <div className="about-feature__number" style={{ fontSize: '40px', fontWeight: '800', color: 'var(--clr-primary)', opacity: '0.3', marginBottom: '15px' }}>01</div>
              <h4 style={{ marginBottom: '15px' }}>Premium Materials</h4>
              <p>We source only the finest materials from around the world. Every component is hand-selected.</p>
            </div>
            <div className="about-feature" style={{ background: '#fff', padding: '40px', borderRadius: 'var(--radius-md)', textAlign: 'center', boxShadow: 'var(--shadow-card)' }}>
              <div className="about-feature__number" style={{ fontSize: '40px', fontWeight: '800', color: 'var(--clr-primary)', opacity: '0.3', marginBottom: '15px' }}>02</div>
              <h4 style={{ marginBottom: '15px' }}>Expert Craftsmanship</h4>
              <p>Our artisans bring decades of experience, ensuring every piece meets the highest standards.</p>
            </div>
            <div className="about-feature" style={{ background: '#fff', padding: '40px', borderRadius: 'var(--radius-md)', textAlign: 'center', boxShadow: 'var(--shadow-card)' }}>
              <div className="about-feature__number" style={{ fontSize: '40px', fontWeight: '800', color: 'var(--clr-primary)', opacity: '0.3', marginBottom: '15px' }}>03</div>
              <h4 style={{ marginBottom: '15px' }}>Modern Design</h4>
              <p>We blend contemporary aesthetics with timeless elegance to create furniture that lasts.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

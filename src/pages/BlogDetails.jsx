import { useParams } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import blogInterior from '../assets/images/blog-interior.png';
import roomLifestyle from '../assets/images/room-lifestyle.png';
import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

export default function BlogDetails() {
  const { id } = useParams();

  return (
    <main className="blog-details-page">
      <PageBanner title="Blog Details" breadcrumbs={['Home', 'Blog Details']} />
      
      <section className="section container">
        <article className="single-blog" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <img src={blogInterior} alt="Blog Cover" style={{ width: '100%', height: '500px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '30px' }} />
          
          <div className="single-blog__meta" style={{ display: 'flex', gap: '20px', color: 'var(--clr-primary)', fontWeight: 'var(--fw-semibold)', fontSize: '14px', marginBottom: '20px' }}>
            <span>By Admin</span>
            <span>24/05/2026</span>
            <span>0 Comments</span>
          </div>
          
          <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', lineHeight: 1.3 }}>10 Ways To Elevate Your Living Room Aesthetics</h1>
          
          <p style={{ color: 'var(--clr-body)', lineHeight: 1.8, marginBottom: '20px' }}>
            Aenean eleifend ante maecenas hendrerit diam vitae mattis vulputate. Integer pellentesque ipsum vel pretium egestas. 
            Donec pulvinar neque a sapien dictum, at vestibulum nisi dictum. Nullam efficitur purus odio, ac congue risus dictum et.
          </p>
          <p style={{ color: 'var(--clr-body)', lineHeight: 1.8, marginBottom: '40px' }}>
            Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam pellentesque non sem 
            luctus volutpat. Curabitur vel turpis ullamcorper, auctor metus et, tempor odio.
          </p>
          
          <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
            <img src={roomLifestyle} alt="Design Inspiration" style={{ flex: 1, borderRadius: '8px', height: '250px', objectFit: 'cover' }} />
            <img src={blogInterior} alt="Design Inspiration" style={{ flex: 1, borderRadius: '8px', height: '250px', objectFit: 'cover' }} />
          </div>
          
          <h3 style={{ marginBottom: '15px' }}>Creating a Cohesive Space</h3>
          <p style={{ color: 'var(--clr-body)', lineHeight: 1.8, marginBottom: '40px' }}>
            Aliquam euismod mi a urna interdum, sit amet tincidunt nibh pellentesque. Sed sed imperdiet lorem. 
            Nam ultrices tristique metus, in consequat odio ullamcorper in. Curabitur mattis vel neque sed dapibus.
          </p>

          <div className="single-blog__footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderTop: '1px solid var(--clr-border)', borderBottom: '1px solid var(--clr-border)' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span style={{ fontWeight: 'bold' }}>Tags:</span>
              <span style={{ color: 'var(--clr-body)' }}>Furniture, Design, Modern</span>
            </div>
            <div style={{ display: 'flex', gap: '15px', color: 'var(--clr-body)' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--clr-heading)' }}>Share:</span>
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaLinkedinIn /></a>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}

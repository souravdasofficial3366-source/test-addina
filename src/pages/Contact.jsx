import { MdOutlineLocationOn, MdOutlineEmail, MdOutlinePhone } from 'react-icons/md';
import PageBanner from '../components/PageBanner';
import './Contact.css';

export default function Contact() {
  return (
    <main className="contact-page" id="contact-page">
      <PageBanner title="Contact" breadcrumbs={['Home', 'Contact']} />

      <section className="contact-info section" style={{ paddingBottom: '0' }}>
        <div className="container">
          <div className="contact-info__list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            <div className="contact-info__card" style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '40px', background: 'var(--clr-light-bg)', borderRadius: 'var(--radius-md)', alignItems: 'center', textAlign: 'center' }}>
              <div className="contact-info__icon" style={{ fontSize: '24px', color: '#fff', background: 'var(--clr-primary)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MdOutlineLocationOn />
              </div>
              <div>
                <h4 style={{ marginBottom: '10px' }}>Our Location</h4>
                <p style={{ margin: 0, fontSize: '15px' }}>House #5, Street Number #98<br/>brasilia- 70000-000, Brazil.</p>
              </div>
            </div>

            <div className="contact-info__card" style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '40px', background: 'var(--clr-light-bg)', borderRadius: 'var(--radius-md)', alignItems: 'center', textAlign: 'center' }}>
              <div className="contact-info__icon" style={{ fontSize: '24px', color: '#fff', background: 'var(--clr-primary)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MdOutlineEmail />
              </div>
              <div>
                <h4 style={{ marginBottom: '10px' }}>Email Address</h4>
                <p style={{ margin: 0, fontSize: '15px' }}>support@mail.com<br/>info@addina.com</p>
              </div>
            </div>

            <div className="contact-info__card" style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '40px', background: 'var(--clr-light-bg)', borderRadius: 'var(--radius-md)', alignItems: 'center', textAlign: 'center' }}>
              <div className="contact-info__icon" style={{ fontSize: '24px', color: '#fff', background: 'var(--clr-primary)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MdOutlinePhone />
              </div>
              <div>
                <h4 style={{ marginBottom: '10px' }}>Phone Number</h4>
                <p style={{ margin: 0, fontSize: '15px' }}>+088889797697<br/>+1 234 567 890</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-content-area section">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: '50px', alignItems: 'stretch' }}>
          
          {/* Map Side */}
          <div className="contact-map" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.2527999863!2d-74.14448744043954!3d40.69763123348122!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbd!4v1689679266104!5m2!1sen!2sbd" 
              width="100%" 
              height="100%" 
              style={{ border: 0, minHeight: '400px' }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map"
            ></iframe>
          </div>

          {/* Form Side */}
          <div className="contact-form-wrap" style={{ padding: '50px', background: 'var(--clr-white)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ marginBottom: '30px' }}>
              <span className="section-subtitle">GET IN TOUCH</span>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Send Us A Message</h2>
            </div>
            <form className="contact-form" onSubmit={(e) => e.preventDefault()} id="contact-form">
              <div className="contact-form__row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                <input type="text" placeholder="Your Name" className="contact-form__input" id="contact-name" style={{ padding: '16px 20px', background: 'var(--clr-light-bg)', borderRadius: 'var(--radius-sm)' }} />
                <input type="email" placeholder="Your Email" className="contact-form__input" id="contact-email" style={{ padding: '16px 20px', background: 'var(--clr-light-bg)', borderRadius: 'var(--radius-sm)' }} />
              </div>
              <input type="text" placeholder="Subject" className="contact-form__input" id="contact-subject" style={{ width: '100%', padding: '16px 20px', background: 'var(--clr-light-bg)', borderRadius: 'var(--radius-sm)', marginBottom: '20px' }} />
              <textarea placeholder="Your Message" className="contact-form__textarea" rows="6" id="contact-message" style={{ width: '100%', padding: '16px 20px', background: 'var(--clr-light-bg)', borderRadius: 'var(--radius-sm)', marginBottom: '30px', resize: 'vertical' }}></textarea>
              <div>
                <button type="submit" className="btn btn--primary" id="contact-submit" style={{ minWidth: '200px' }}>SEND MESSAGE</button>
              </div>
            </form>
          </div>

        </div>
      </section>
    </main>
  );
}

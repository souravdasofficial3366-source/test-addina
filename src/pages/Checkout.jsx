import { useState } from 'react';
import { useCart } from '../context/CartContext';
import PageBanner from '../components/PageBanner';

export default function Checkout() {
  const { cartItems } = useCart();
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const [paymentMethod, setPaymentMethod] = useState('stripe');

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (paymentMethod === 'stripe') {
      // Logic for Stripe Checkout redirection goes here
      alert("Redirecting to Stripe Checkout via API... (Requires Backend Keys)");
    } else {
      alert("Order placed successfully with " + paymentMethod);
    }
  };

  return (
    <main className="checkout-page">
      <PageBanner title="Checkout" breadcrumbs={['Home', 'Checkout']} />

      <section className="section container" style={{ padding: '80px 0' }}>
        <form onSubmit={handlePlaceOrder} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '50px' }}>
          
          {/* Billing Details */}
          <div className="checkout__billing">
            <h3 style={{ marginBottom: '30px', borderBottom: '1px solid var(--clr-border)', paddingBottom: '10px' }}>Billing Details</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--clr-body)' }}>First Name *</label>
                <input type="text" required style={{ width: '100%', padding: '12px 15px', border: '1px solid var(--clr-border)', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--clr-body)' }}>Last Name *</label>
                <input type="text" required style={{ width: '100%', padding: '12px 15px', border: '1px solid var(--clr-border)', borderRadius: '4px' }} />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--clr-body)' }}>Company Name (Optional)</label>
              <input type="text" style={{ width: '100%', padding: '12px 15px', border: '1px solid var(--clr-border)', borderRadius: '4px' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--clr-body)' }}>Country / Region *</label>
              <select required style={{ width: '100%', padding: '12px 15px', border: '1px solid var(--clr-border)', borderRadius: '4px', background: '#fff' }}>
                <option value="us">United States (US)</option>
                <option value="uk">United Kingdom (UK)</option>
                <option value="ca">Canada</option>
                <option value="au">Australia</option>
                <option value="in">India</option>
                <option value="de">Germany</option>
                <option value="fr">France</option>
                <option value="jp">Japan</option>
                <option value="cn">China</option>
                <option value="br">Brazil</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--clr-body)' }}>Street Address *</label>
              <input type="text" placeholder="House number and street name" required style={{ width: '100%', padding: '12px 15px', border: '1px solid var(--clr-border)', borderRadius: '4px', marginBottom: '10px' }} />
              <input type="text" placeholder="Apartment, suite, unit etc. (optional)" style={{ width: '100%', padding: '12px 15px', border: '1px solid var(--clr-border)', borderRadius: '4px' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--clr-body)' }}>Town / City *</label>
              <input type="text" required style={{ width: '100%', padding: '12px 15px', border: '1px solid var(--clr-border)', borderRadius: '4px' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--clr-body)' }}>State / County *</label>
                <input type="text" required style={{ width: '100%', padding: '12px 15px', border: '1px solid var(--clr-border)', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--clr-body)' }}>Postcode / ZIP *</label>
                <input type="text" required style={{ width: '100%', padding: '12px 15px', border: '1px solid var(--clr-border)', borderRadius: '4px' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--clr-body)' }}>Phone *</label>
                <input type="tel" required style={{ width: '100%', padding: '12px 15px', border: '1px solid var(--clr-border)', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--clr-body)' }}>Email Address *</label>
                <input type="email" required style={{ width: '100%', padding: '12px 15px', border: '1px solid var(--clr-border)', borderRadius: '4px' }} />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--clr-body)' }}>Order Notes (Optional)</label>
              <textarea placeholder="Notes about your order, e.g. special notes for delivery." rows="4" style={{ width: '100%', padding: '12px 15px', border: '1px solid var(--clr-border)', borderRadius: '4px' }}></textarea>
            </div>
          </div>

          {/* Order Summary & Payment */}
          <div className="checkout__order" style={{ background: 'var(--clr-light-bg)', padding: '40px', borderRadius: '4px', height: 'fit-content' }}>
            <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--clr-border)', paddingBottom: '10px' }}>Your Order</h3>
            
            <div style={{ borderBottom: '1px solid var(--clr-border)', paddingBottom: '15px', marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'var(--fw-bold)', marginBottom: '15px' }}>
                <span>Product</span>
                <span>Subtotal</span>
              </div>
              {cartItems.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: 'var(--clr-body)' }}>
                  <span>{item.name} × {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid var(--clr-border)' }}>
              <h4 style={{ marginBottom: '15px', fontSize: '1rem', color: 'var(--clr-heading)' }}>Have a Coupon?</h4>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" placeholder="Coupon Code" style={{ flex: 1, padding: '12px 15px', border: '1px solid var(--clr-border)', borderRadius: '4px' }} />
                <button type="button" className="btn btn--outline" onClick={() => alert('Coupon functionality will be activated once connected to your backend!')}>Apply</button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: 'var(--clr-body)' }}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--clr-border)', paddingBottom: '20px', color: 'var(--clr-body)' }}>
              <span>Shipping</span>
              <span>Free Shipping</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', fontWeight: 'var(--fw-bold)', fontSize: '1.25rem', color: 'var(--clr-heading)' }}>
              <span>Total</span>
              <span style={{ color: 'var(--clr-primary)' }}>${subtotal.toFixed(2)}</span>
            </div>

            <div className="checkout__payment" style={{ marginBottom: '30px' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: paymentMethod === 'bank' ? 'var(--fw-bold)' : 'normal', cursor: 'pointer' }}>
                  <input type="radio" name="payment" checked={paymentMethod === 'bank'} onChange={() => setPaymentMethod('bank')} />
                  Direct Bank Transfer
                </label>
                {paymentMethod === 'bank' && <p style={{ padding: '10px 15px', background: '#fff', fontSize: '14px', color: 'var(--clr-body)', marginTop: '10px', borderRadius: '4px' }}>Make your payment directly into our bank account. Please use your Order ID as the payment reference.</p>}
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: paymentMethod === 'stripe' ? 'var(--fw-bold)' : 'normal', cursor: 'pointer' }}>
                  <input type="radio" name="payment" checked={paymentMethod === 'stripe'} onChange={() => setPaymentMethod('stripe')} />
                  Credit Card (Stripe)
                </label>
                {paymentMethod === 'stripe' && <p style={{ padding: '10px 15px', background: '#fff', fontSize: '14px', color: 'var(--clr-body)', marginTop: '10px', borderRadius: '4px' }}>Pay securely with your credit card via Stripe payment gateway.</p>}
              </div>
            </div>

            <button type="submit" className="btn btn--primary" style={{ width: '100%', textAlign: 'center', justifyContent: 'center', padding: '15px 0', fontSize: '1.1rem' }}>
              PLACE ORDER
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

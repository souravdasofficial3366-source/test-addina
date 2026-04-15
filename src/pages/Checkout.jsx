import { useState } from 'react';
import { useCart } from '../context/CartContext';
import PageBanner from '../components/PageBanner';
import './Checkout.css';

export default function Checkout() {
  const { cartItems } = useCart();
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const [paymentMethod, setPaymentMethod] = useState('stripe');

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (paymentMethod === 'stripe') {
      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: cartItems })
        });
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url; // Redirect to Stripe's secure Checkout Page
        } else {
          alert('Payment Error: ' + data.error);
        }
      } catch (error) {
        alert('Failed to connect to securely local backend server. ' + error.message);
      }
    } else {
      alert(`Order placed successfully using ${paymentMethod}! Invoice generated.`);
    }
  };

  return (
    <main className="checkout-page">
      <PageBanner title="Checkout" breadcrumbs={['Home', 'Checkout']} />

      <section className="section">
        <div className="container">
          <form onSubmit={handlePlaceOrder} className="checkout-form">

            {/* Billing Details */}
            <div className="checkout__billing">
              <h3>Billing Details</h3>

              <div className="checkout__row">
                <div className="checkout__field">
                  <label>First Name *</label>
                  <input type="text" required className="checkout__input" />
                </div>
                <div className="checkout__field">
                  <label>Last Name *</label>
                  <input type="text" required className="checkout__input" />
                </div>
              </div>

              <div className="checkout__field">
                <label>Company Name (Optional)</label>
                <input type="text" className="checkout__input" />
              </div>

              <div className="checkout__field">
                <label>Country / Region *</label>
                <select required className="checkout__select">
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

              <div className="checkout__field">
                <label>Street Address *</label>
                <input type="text" placeholder="House number and street name" required className="checkout__input" />
                <input type="text" placeholder="Apartment, suite, unit etc. (optional)" className="checkout__input" />
              </div>

              <div className="checkout__field">
                <label>Town / City *</label>
                <input type="text" required className="checkout__input" />
              </div>

              <div className="checkout__row">
                <div className="checkout__field">
                  <label>State / County *</label>
                  <input type="text" required className="checkout__input" />
                </div>
                <div className="checkout__field">
                  <label>Postcode / ZIP *</label>
                  <input type="text" required className="checkout__input" />
                </div>
              </div>

              <div className="checkout__row">
                <div className="checkout__field">
                  <label>Phone *</label>
                  <input type="tel" required className="checkout__input" />
                </div>
                <div className="checkout__field">
                  <label>Email Address *</label>
                  <input type="email" required className="checkout__input" />
                </div>
              </div>

              <div className="checkout__field">
                <label>Order Notes (Optional)</label>
                <textarea
                  placeholder="Notes about your order, e.g. special notes for delivery."
                  rows="4"
                  className="checkout__textarea"
                />
              </div>
            </div>

            {/* Order Summary & Payment */}
            <div className="checkout__order">
              <h3>Your Order</h3>

              <div className="checkout__order-items">
                <div className="checkout__order-header">
                  <span>Product</span>
                  <span>Subtotal</span>
                </div>
                {cartItems.map((item) => (
                  <div key={item.id} className="checkout__order-item">
                    <span>{item.name} × {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="checkout__coupon">
                <h4>Have a Coupon?</h4>
                <div className="checkout__coupon-row">
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    className="checkout__coupon-input"
                  />
                  <button
                    type="button"
                    className="btn btn--outline"
                    onClick={() => alert('Coupon functionality will be activated once connected to your backend!')}
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="checkout__summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="checkout__summary-row">
                <span>Shipping</span>
                <span>Free Shipping</span>
              </div>
              <div className="checkout__summary-total">
                <span>Total</span>
                <span className="checkout__total-price">${subtotal.toFixed(2)}</span>
              </div>

              <div className="checkout__payment">
                <div className="checkout__payment-option">
                  <label className="checkout__payment-label">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'bank'}
                      onChange={() => setPaymentMethod('bank')}
                    />
                    Direct Bank Transfer
                  </label>
                  {paymentMethod === 'bank' && (
                    <p className="checkout__payment-note">
                      Make your payment directly into our bank account. Please use your Order ID as the payment reference.
                    </p>
                  )}
                </div>

                <div className="checkout__payment-option">
                  <label className="checkout__payment-label">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'stripe'}
                      onChange={() => setPaymentMethod('stripe')}
                    />
                    Credit Card (Stripe)
                  </label>
                  {paymentMethod === 'stripe' && (
                    <p className="checkout__payment-note">
                      Pay securely with your credit card via Stripe payment gateway.
                    </p>
                  )}
                </div>
              </div>

              <button type="submit" className="btn btn--primary checkout__submit">
                PLACE ORDER
              </button>
            </div>

          </form>
        </div>
      </section>
    </main>
  );
}

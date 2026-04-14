import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiTrash2 } from 'react-icons/fi';
import PageBanner from '../components/PageBanner';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const [coupon, setCoupon] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <main className="cart-page">
      <PageBanner title="Cart" breadcrumbs={['Home', 'Cart']} />

      <section className="section container" style={{ padding: '80px 0' }}>
        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <h2>Your cart is empty!</h2>
            <p style={{ margin: '20px 0' }}>Looks like you haven't added any furniture to your cart yet.</p>
            <Link to="/shop" className="btn btn--primary">CONTINUE SHOPPING</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>
            {/* Cart Items Table Area */}
            <div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'var(--clr-light-bg)', borderBottom: '1px solid var(--clr-border)' }}>
                      <th style={{ padding: '15px' }}>Product</th>
                      <th style={{ padding: '15px' }}>Price</th>
                      <th style={{ padding: '15px' }}>Quantity</th>
                      <th style={{ padding: '15px' }}>Total</th>
                      <th style={{ padding: '15px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid var(--clr-border)' }}>
                        <td style={{ padding: '20px 15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'contain', background: '#f5f5f5', borderRadius: '4px' }} />
                          <Link to={`/product/${item.id}`} style={{ fontWeight: 'var(--fw-semibold)', color: 'var(--clr-heading)' }}>{item.name}</Link>
                        </td>
                        <td style={{ padding: '20px 15px', color: 'var(--clr-body)' }}>${item.price.toFixed(2)}</td>
                        <td style={{ padding: '20px 15px' }}>
                          <div style={{ display: 'inline-flex', border: '1px solid var(--clr-border)', borderRadius: '4px', height: '40px' }}>
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ width: '30px', background: 'transparent', border: 'none', cursor: 'pointer' }}>-</button>
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', fontSize: '14px', borderLeft: '1px solid var(--clr-border)', borderRight: '1px solid var(--clr-border)' }}>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ width: '30px', background: 'transparent', border: 'none', cursor: 'pointer' }}>+</button>
                          </div>
                        </td>
                        <td style={{ padding: '20px 15px', fontWeight: 'var(--fw-semibold)', color: 'var(--clr-primary)' }}>${(item.price * item.quantity).toFixed(2)}</td>
                        <td style={{ padding: '20px 15px' }}>
                          <button onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', border: 'none', color: 'red', cursor: 'pointer', fontSize: '18px' }} aria-label="Remove">
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="text" placeholder="Coupon Code" value={coupon} onChange={(e) => setCoupon(e.target.value)} style={{ padding: '12px 20px', border: '1px solid var(--clr-border)', borderRadius: '4px', width: '200px' }} />
                  <button className="btn btn--primary" style={{ padding: '12px 30px' }}>APPLY COUPON</button>
                </div>
                <Link to="/shop" className="btn btn--outline">CONTINUE SHOPPING</Link>
              </div>
            </div>

            {/* Cart Totals Area */}
            <div style={{ background: 'var(--clr-light-bg)', padding: '30px', borderRadius: '4px', height: 'fit-content' }}>
              <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--clr-border)', paddingBottom: '10px' }}>Cart Totals</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: 'var(--clr-body)' }}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--clr-border)', paddingBottom: '20px', color: 'var(--clr-body)' }}>
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', fontWeight: 'var(--fw-bold)', fontSize: '1.25rem', color: 'var(--clr-heading)' }}>
                <span>Total</span>
                <span style={{ color: 'var(--clr-primary)' }}>${subtotal.toFixed(2)}</span>
              </div>
              <Link to="/checkout" className="btn btn--primary" style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}>PROCEED TO CHECKOUT</Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

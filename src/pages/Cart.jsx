import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiTrash2 } from 'react-icons/fi';
import PageBanner from '../components/PageBanner';
import './Cart.css';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const [coupon, setCoupon] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <main className="cart-page">
      <PageBanner title="Cart" breadcrumbs={['Home', 'Cart']} />

      <section className="section">
        <div className="container">
          {cartItems.length === 0 ? (
            <div className="cart-page__empty">
              <h2>Your cart is empty!</h2>
              <p>Looks like you haven't added any furniture to your cart yet.</p>
              <Link to="/shop" className="btn btn--primary">CONTINUE SHOPPING</Link>
            </div>
          ) : (
            <div className="cart-page__layout">
              {/* Cart Items */}
              <div>
                <div className="cart-table-wrap">
                  <table className="cart-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="cart-table__product">
                              <img src={item.image} alt={item.name} className="cart-table__img" />
                              <Link to={`/product/${item.id}`} className="cart-table__name">{item.name}</Link>
                            </div>
                          </td>
                          <td className="cart-table__price">${item.price.toFixed(2)}</td>
                          <td>
                            <div className="cart-qty">
                              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                              <span>{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                            </div>
                          </td>
                          <td className="cart-table__total">${(item.price * item.quantity).toFixed(2)}</td>
                          <td>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="cart-table__remove"
                              aria-label="Remove item"
                            >
                              <FiTrash2 />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="cart-actions">
                  <div className="cart-coupon">
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="cart-coupon__input"
                    />
                    <button className="btn btn--primary">APPLY COUPON</button>
                  </div>
                  <Link to="/shop" className="btn btn--outline">CONTINUE SHOPPING</Link>
                </div>
              </div>

              {/* Cart Totals */}
              <div className="cart-totals">
                <h3 className="cart-totals__title">Cart Totals</h3>
                <div className="cart-totals__row">
                  <span>Subtotal</span>
                  <span className="cart-totals__price">${subtotal.toFixed(2)}</span>
                </div>
                <div className="cart-totals__row">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="cart-totals__row cart-totals__row--total">
                  <span>Total</span>
                  <span className="cart-totals__price">${subtotal.toFixed(2)}</span>
                </div>
                <Link to="/checkout" className="btn btn--primary cart-totals__checkout">
                  PROCEED TO CHECKOUT
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

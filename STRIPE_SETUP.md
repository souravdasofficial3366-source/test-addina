# Stripe Implementation Guide

The Checkout Page currently executes a mock checkout action when "Place Order" via Credit Card is selected (`alert('Redirecting to Stripe Checkout...')`). 
Because the frontend interface is thoroughly crafted, completing actual transactions merely requires adding your client's API keys when launching the final backend!

Here is how you or your client finalize the payment functionality:

## Phase 1: Retrieve Live Keys

Log into your (or your client's) actual [Stripe Dashboard](https://dashboard.stripe.com/).
1. Head to **Developers > API Keys**.
2. Copy the **Publishable key** (`pk_live_...` or `pk_test_...`).
3. Copy the **Secret key** (`sk_live_...` or `sk_test_...`). 
   *Note: Never place Secret Keys directly into `Checkout.jsx` or any frontend code! Keep it locked tightly on your backend servers.*

---

## Phase 2: Frontend Hooks (React/Vite)

You’ll want a Stripe helper attached to the "Place Order" button. Since this app runs React/Vite, use an environment variable for the *Public* key.

```bash
npm install @stripe/stripe-js
```

Inside `.env.local` in your root folder, stash the target variable:
`VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxxxxxx`

Modify `Checkout.jsx` slightly:
```javascript
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const handlePlaceOrder = async (e) => {
  e.preventDefault();
  if (paymentMethod === 'stripe') {
    const stripe = await stripePromise;
    // Call YOUR backend
    const response = await fetch('/api/create-checkout', {
      method: 'POST',
      body: JSON.stringify({ items: cartItems }),
      headers: {'Content-Type': 'application/json'}
    });
    
    const session = await response.json();
    // Redirect securely to Stripe's payment vault!
    await stripe.redirectToCheckout({ sessionId: session.id });
  }
};
```

---

## Phase 3: Build A Secure Node.js Backend 

To securely calculate total prices and bridge directly with Stripe, hand this backend template to whoever mounts their server infrastructure (e.g. Next.js serverless functions, Express server, etc).

```bash
npm install stripe
```

**Express Backend Node.js Example (`server.js`)**:
```javascript
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Using your secret key
const app = express();

app.post('/api/create-checkout', async (req, res) => {
  const { items } = req.body;
  
  // Conform generic cart items to Stripe Line Items
  const lineItems = items.map(item => ({
    price_data: {
        currency: 'usd',
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100), // Prices calculated accurately in cents
    },
    quantity: item.quantity,
  }));

  // Create the Secure Stripe Checkout Session instance
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    // Define precisely where you return upon successful transactions!
    success_url: 'http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'http://localhost:5173/checkout',
  });

  // Dispatches Session ID back to Checkout.jsx!
  res.json({ id: session.id });
});

app.listen(4242, () => console.log('Node server hooked into Stripe on port 4242!'));
```

Provide this Markdown file directly to your end client; they will have a totally streamlined path to accepting worldwide purchases using their specific banking details!

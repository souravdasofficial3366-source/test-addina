import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();
const PORT = process.env.PORT || 4242;

app.use(cors());
app.use(express.json());

// Main checkout endpoint
app.post('/api/checkout', async (req, res) => {
  try {
    const { items } = req.body; // Expects an array of items from the React Cart

    // Validate request
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty. Please add items before checking out.' });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: 'Stripe Secret Key is missing in the backend configuration.' });
    }

    // Transform React cart items into Stripe line_items format
    const line_items = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          // Images must be absolute HTTPS URLs accessible explicitly to Stripe's servers.
          // Because we securely migrated your images internally (e.g., '/images/sofa.png'),
          // we selectively omit images here so Stripe doesn't throw a validation error.
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects amounts in cents
      },
      quantity: item.quantity,
    }));

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `http://localhost:5173/checkout?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/cart?canceled=true`,
      metadata: {
        total_items: items.reduce((sum, item) => sum + item.quantity, 0)
      }
    });

    // Send the securely generated session URL back to the React frontend
    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
  console.log(`Ready to process secure payments via Stripe Checkout!`);
});

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { cart, shippingPrice } = req.body;

  try {
    const line_items = cart.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.productId.title,
          images: item.productId.image ? [item.productId.image] : [],
        },
        unit_amount: Math.round(item.productId.price * 100), // in cents
      },
      quantity: item.quantity,
    }));

    // Add shipping as a separate line item (optional)
    if (shippingPrice > 0) {
      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Shipping Fee' },
          unit_amount: Math.round(shippingPrice * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${req.headers.origin}/shop/success`,
      cancel_url: `${req.headers.origin}/shop/purchase`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Stripe checkout session creation failed' });
  }
}

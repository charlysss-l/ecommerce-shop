import { useState } from 'react';
import { useRouter } from 'next/router';
import CustomerNavbar from '../../components/CustomerNavbar';
import { useCustomer } from '../../context/CustomerContext';
import ProtectedCustomer from '../../components/ProtectedCustomer';

export default function PurchasePage() {
  const { cart, addToPurchaseHistory } = useCustomer(); // Make sure your context has this function
  const router = useRouter();
  const shippingPrice = 500;
  const [paymentMethod, setPaymentMethod] = useState('Cash On Delivery');
  const [loading, setLoading] = useState(false);

  // Compute totals safely
  const productTotal = cart.reduce((sum, item) => {
    const price = item?.productId?.price ?? 0;
    const quantity = item?.quantity ?? 0;
    return sum + Number(price) * Number(quantity);
  }, 0);

  const totalPayment = productTotal + shippingPrice;

  // Handle Cash on Delivery
  const handleCOD = async () => {
    setLoading(true);

    // Simulate 5-second processing
    setTimeout(() => {
      // Save order to purchase history (context or DB)
      addToPurchaseHistory({
        id: Date.now(),
        cart,
        paymentMethod: 'Cash On Delivery',
        totalPayment,
      });

      setLoading(false);
      router.push('/shop/purchase/success');
    }, 5000);
  };

  // Handle Stripe Checkout
  const handleStripeCheckout = async () => {
    if (!cart || cart.length === 0) return alert('Cart is empty');
    setLoading(true);
    try {
      const res = await fetch('/api/checkout-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Stripe API error: ${text}`);
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // redirect to Stripe Checkout
      } else {
        alert('Stripe checkout failed');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert('Error during Stripe checkout: ' + err.message);
      setLoading(false);
    }
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) return alert('Cart is empty');
    if (paymentMethod === 'Cash On Delivery') handleCOD();
    else if (paymentMethod === 'Credit Card') handleStripeCheckout();
    else alert('Selected payment method not supported');
  };

  return (
    <ProtectedCustomer>
      <CustomerNavbar />
      <div style={{ padding: 20 }}>
        <h1>Checkout</h1>

        <h2>Products</h2>
        {cart.length === 0 && <p>Your cart is empty.</p>}
        {cart.map(item => {
          const product = item.productId;
          if (!product) return null;
          return (
            <div
              key={product._id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '1px solid #ccc',
                marginBottom: 10,
                paddingBottom: 10
              }}
            >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.title}
                  style={{ width: 80, height: 80, objectFit: 'cover', marginBottom: 5 }}
                />
              )}
              <p><strong>{product.title}</strong></p>
              <p>Unit Price: ${Number(product.price).toFixed(2)}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Total: ${(Number(product.price) * Number(item.quantity)).toFixed(2)}</p>
            </div>
          );
        })}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
          <h2>Shipping</h2>
          <p>Shipping Fee: ${shippingPrice.toFixed(2)}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
          <h2>Payment Method</h2>
          <select
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value)}
            style={{ padding: 5 }}
          >
            <option value="Cash On Delivery">Cash On Delivery</option>
            <option value="Credit Card">Credit Card (Stripe)</option>
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
          <h2>Payment Details</h2>
          <div>
            <p>Products Total: ${productTotal.toFixed(2)}</p>
            <p>Shipping Total: ${shippingPrice.toFixed(2)}</p>
            <h3>Total Payment: ${totalPayment.toFixed(2)}</h3>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={loading || cart.length === 0}
          style={{
            marginTop: 20,
            padding: '10px 20px',
            backgroundColor: paymentMethod === 'Credit Card' ? 'blue' : 'green',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Processing...' : paymentMethod === 'Credit Card' ? 'Pay with Card' : 'Place Order'}
        </button>
      </div>
    </ProtectedCustomer>
  );
}

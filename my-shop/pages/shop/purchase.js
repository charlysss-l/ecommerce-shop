// pages/shop/purchase.js
import { useState } from 'react';
import CustomerNavbar from '../../components/CustomerNavbar';
import { useCustomer } from '../../context/CustomerContext';

export default function PurchasePage() {
  const { cart } = useCustomer();
  const shippingPrice = 500; // default shipping fee
  const [paymentMethod, setPaymentMethod] = useState('Cash On Delivery');

  // Compute totals
  const productTotal = cart.reduce(
    (sum, item) => sum + Number(item.productId.price) * Number(item.quantity),
    0
  );
  const totalPayment = productTotal + shippingPrice;

  const handlePlaceOrder = () => {
    alert(`Order placed!\nTotal Payment: ${totalPayment.toFixed(2)} via ${paymentMethod}`);
    // Here you can call API to save order in DB
  };

  return (
    <>
      <CustomerNavbar />
      <div style={{ padding: 20 }}>
        <h1>Checkout</h1>

        <h2>Products</h2>
        {cart.length === 0 && <p>Your cart is empty.</p>}
        {cart.map(item => (
          <div key={item.productId._id} style={{ borderBottom: '1px solid #ccc', marginBottom: 10, paddingBottom: 10 }}>
            <p><strong>{item.productId.title}</strong></p>
            <p>Unit Price: ${Number(item.productId.price).toFixed(2)}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Total: ${(Number(item.productId.price) * Number(item.quantity)).toFixed(2)}</p>
          </div>
        ))}

        <h2>Shipping</h2>
        <p>Shipping Fee: ${shippingPrice.toFixed(2)}</p>

        <h2>Payment Method</h2>
        <select
          value={paymentMethod}
          onChange={e => setPaymentMethod(e.target.value)}
          style={{ padding: 5 }}
        >
          <option value="Cash On Delivery">Cash On Delivery</option>
          <option value="PayPal">PayPal</option>
          <option value="Credit Card">Credit Card</option>
        </select>

        <h2>Payment Details</h2>
        <p>Products Total: ${productTotal.toFixed(2)}</p>
        <p>Shipping Total: ${shippingPrice.toFixed(2)}</p>
        <h3>Total Payment: ${totalPayment.toFixed(2)}</h3>

        <button
          onClick={handlePlaceOrder}
          style={{
            marginTop: 20,
            padding: '10px 20px',
            backgroundColor: 'green',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Place Order
        </button>
      </div>
    </>
  );
}

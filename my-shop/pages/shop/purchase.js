import { useState } from 'react';
import CustomerNavbar from '../../components/CustomerNavbar';
import { useCustomer } from '../../context/CustomerContext';
import ProtectedCustomer from '../../components/ProtectedCustomer';

export default function PurchasePage() {
  const { cart } = useCustomer();
  const shippingPrice = 500; // default shipping fee
  const [paymentMethod, setPaymentMethod] = useState('Cash On Delivery');

  // Compute totals safely
  const productTotal = cart.reduce(
    (sum, item) => {
      const price = item?.productId?.price ?? 0;
      const quantity = item?.quantity ?? 0;
      return sum + Number(price) * Number(quantity);
    },
    0
  );

  const totalPayment = productTotal + shippingPrice;

  const handlePlaceOrder = () => {
    alert(`Order placed!\nTotal Payment: ${totalPayment.toFixed(2)} via ${paymentMethod}`);
    // Here you can call API to save order in DB
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
          if (!product) return null; // skip missing product

          return (
            <div key={product._id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc', marginBottom: 10, paddingBottom: 10 }}>
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
        <div className="shipping-container" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
          <h2>Shipping</h2>
          <p>Shipping Fee: ${shippingPrice.toFixed(2)}</p>

        </div>
        <div className="payment-method" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>

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
        </div>
        <div className="payment-details" style={{display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
          <h2>Payment Details</h2>
          <p>Products Total: ${productTotal.toFixed(2)}</p>
          <p>Shipping Total: ${shippingPrice.toFixed(2)}</p>
          <h3>Total Payment: ${totalPayment.toFixed(2)}</h3>
        </div>
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
    </ProtectedCustomer>
  );
}

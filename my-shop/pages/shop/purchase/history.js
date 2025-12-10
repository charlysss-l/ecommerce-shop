import { useCustomer } from '../../../context/CustomerContext';
import CustomerNavbar from '../../../components/CustomerNavbar';
import ProtectedCustomer from '../../../components/ProtectedCustomer';

export default function PurchaseHistory() {
  const { purchaseHistory } = useCustomer(); // Make sure you save order in your context or DB

  return (
    <ProtectedCustomer>
      <CustomerNavbar />
      <div style={{ padding: 20 }}>
        <h1>Purchase History</h1>
        {purchaseHistory.length === 0 ? (
          <p>No purchases yet.</p>
        ) : (
          purchaseHistory.map((order, idx) => (
            <div key={idx} style={{ borderBottom: '1px solid #ccc', marginBottom: 10, paddingBottom: 10 }}>
              <p><strong>Order #{order.id}</strong></p>
              <p>Total Payment: ${order.totalPayment.toFixed(2)}</p>
              <p>Payment Method: {order.paymentMethod}</p>
              <p>Products:</p>
              <ul>
                {order.cart.map(item => (
                  <li key={item.productId._id}>
                    {item.productId.title} x {item.quantity} = ${(item.productId.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </ProtectedCustomer>
  );
}

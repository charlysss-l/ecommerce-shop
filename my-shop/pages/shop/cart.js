import { useCustomer } from '../../context/CustomerContext';
import CustomerNavbar from '../../components/CustomerNavbar';
import { useRouter } from 'next/router';
import ProtectedCustomer from '../../components/ProtectedCustomer';

export default function CartPage() {
  const { cart, updateCartQuantity, removeFromCart } = useCustomer();
  const router = useRouter();
  // Calculate total for each item and overall total
  const totalPrice = cart.reduce(
    (sum, item) => sum + Number(item.productId.price) * Number(item.quantity),
    0
  );


  return (
    <ProtectedCustomer>
      <CustomerNavbar />
      <div style={{ padding: 20 }}>
        <h1>My Cart</h1>
        {cart.length === 0 && <p>Your cart is empty.</p>}

        {cart.length > 0 && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ borderBottom: '1px solid #ccc', padding: 8, textAlign: 'left' }}>Product Name</th>
                <th style={{ borderBottom: '1px solid #ccc', padding: 8 }}>Price</th>
                <th style={{ borderBottom: '1px solid #ccc', padding: 8 }}>Quantity</th>
                <th style={{ borderBottom: '1px solid #ccc', padding: 8 }}>Total Price</th>
                <th style={{ borderBottom: '1px solid #ccc', padding: 8 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.productId._id}>
                  <td style={{ borderBottom: '1px solid #ccc', padding: 8 }}>{item.productId.title}</td>
                  <td style={{ borderBottom: '1px solid #ccc', padding: 8 }}>${item.productId.price}</td>
                  <td style={{ borderBottom: '1px solid #ccc', padding: 8 }}>
                    <button onClick={() => updateCartQuantity(item.productId._id, item.quantity - 1)}>-</button>
                    <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                    <button onClick={() => updateCartQuantity(item.productId._id, item.quantity + 1)}>+</button>
                  </td>
                  <td style={{ borderBottom: '1px solid #ccc', padding: 8 }}>
                   ${(Number(item.productId.price) * Number(item.quantity)).toFixed(2)}
                  </td>
                  <td style={{ borderBottom: '1px solid #ccc', padding: 8 }}>
                    <button onClick={() => removeFromCart(item.productId._id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} style={{ padding: 8, fontWeight: 'bold', textAlign: 'right' }}>Total:</td>
                <td style={{ padding: 8, fontWeight: 'bold' }}>${totalPrice.toFixed(2)}</td>
                <td style={{ padding: 8, textAlign: 'right' }}>
                  <button
                    onClick={() => router.push('/shop/purchase')}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: 'blue',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Check Out
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </ProtectedCustomer>
  );
}

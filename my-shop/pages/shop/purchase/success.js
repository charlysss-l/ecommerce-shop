import { useEffect } from 'react';
import { useRouter } from 'next/router';
import CustomerNavbar from '../../../components/CustomerNavbar';
import ProtectedCustomer from '../../../components/ProtectedCustomer';

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/shop/purchase/history'); 
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <ProtectedCustomer>
      <CustomerNavbar />
      <div style={{ textAlign: 'center', marginTop: 100 }}>
        <h1>Order Placed Successfully!</h1>
        <p>Redirecting to Purchase History...</p>

        {/* Loading spinner */}
        <div style={{ marginTop: 50 }}>
          <div style={{
            width: 50,
            height: 50,
            border: '6px solid #ccc',
            borderTop: '6px solid #4CAF50',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
        </div>

        {/* Spinner animation keyframes */}
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </ProtectedCustomer>
  );
}

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ProtectedCustomer({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('customerToken');
    if (!token) {
      router.push('/shop/login'); // redirect to login if not authenticated
    }
  }, [router]);

  return <>{children}</>;
}

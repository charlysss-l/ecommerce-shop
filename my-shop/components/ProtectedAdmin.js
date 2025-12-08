import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ProtectedAdmin({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login'); // redirect to login if not authenticated
    }
  }, [router]);

  return <>{children}</>;
}

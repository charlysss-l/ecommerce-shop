import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/CustomerNavbar';

export default function ProfilePage() {
  const router = useRouter();
  const [customer, setCustomer] = useState(null); // start as null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('customerToken');
    if (!token) {
      router.push('/shop/login');
      return;
    }

    fetch('/api/user/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCustomer(data.user);
        } else {
          throw new Error('Failed to fetch user');
        }
      })
      .catch(err => {
        console.error(err);
        localStorage.removeItem('customerToken');
        router.push('/shop/login');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!customer) return <p>No user data found.</p>;

  return (
    <>
      <Navbar />
      <div style={{ padding: 20 }}>
        <h1>Profile</h1>
        <p><strong>Name:</strong> {customer.name}</p>
        <p><strong>Email:</strong> {customer.email}</p>
        <p><strong>Role:</strong> {customer.role}</p>
      </div>
    </>
  );
}

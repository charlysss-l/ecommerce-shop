import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';

export default function ProfilePage() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null); // start as null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.replace('/admin/login');
      return;
    }

    fetch('/api/user/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAdmin(data.user);
        } else {
          throw new Error('Failed to fetch user');
        }
      })
      .catch(err => {
        console.error(err);
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!admin) return <p>No user data found.</p>;

  return (
    <>
      <Navbar />
      <div style={{ padding: 20 }}>
        <h1>Profile</h1>
        <p><strong>Name:</strong> {admin.name}</p>
        <p><strong>Email:</strong> {admin.email}</p>
       
      </div>
    </>
  );
}

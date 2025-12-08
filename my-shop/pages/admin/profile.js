import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';

export default function ProfilePage() {
  const router = useRouter();
  const [admin, setAdmin] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetch('/api/admin/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch admin data');
        return res.json();
      })
      .then(data => {
        setAdmin({
          name: data.name || '',
          email: data.email || '',
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
      });
  }, [router]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: 20 }}>Loading...</div>
      </>
    );
  }

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

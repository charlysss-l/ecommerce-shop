import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.replace('/admin/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user/list', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!data.success) throw new Error('Failed to fetch users');

        setUsers(data.users);
      } catch (err) {
        console.error(err);
        router.replace('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  if (loading) return <><Navbar /><div style={{ padding: 20 }}>Loading users...</div></>;

  return (
    <>
      <Navbar />
      <div style={{ padding: 20 }}>
        <h1>All Users</h1>
       <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>  {/* 'admin' or 'customer' */}
                </tr>
                ))}
            </tbody>
            </table>

      </div>
    </>
  );
}

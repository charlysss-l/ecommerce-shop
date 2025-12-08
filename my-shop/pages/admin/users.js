import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Filter
  const [currentPage, setCurrentPage] = useState(1);
  const [filterRole, setFilterRole] = useState('All');
  const itemsPerPage = 5;

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

  // Filtered users
  const filteredUsers = filterRole === 'All'
    ? users
    : users.filter(u => u.role.toLowerCase() === filterRole.toLowerCase());

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading) return <><Navbar /><div style={{ padding: 20 }}>Loading users...</div></>;

  return (
    <>
      <Navbar />
      <div style={{ padding: 20 }}>
        <h1>All Users</h1>

        {/* Role Filter */}
        <div style={{ marginBottom: 20 }}>
          <label>
            Filter by Role:{' '}
            <select
              value={filterRole}
              onChange={(e) => {
                setFilterRole(e.target.value);
                setCurrentPage(1); // reset page when filter changes
              }}
            >
              <option value="All">All</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
            </select>
          </label>
        </div>

        {/* Users Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Name</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Email</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Role</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map(user => (
              <tr key={user._id}>
                <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>{user.name}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>{user.email}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            Prev
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
    </>
  );
}

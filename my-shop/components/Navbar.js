// components/Navbar.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Navbar.module.css';

export default function Navbar() {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>MyShop</div>

      <ul className={styles.menu}>
        <li><Link href="/admin">Home</Link></li>
        <li><Link href="/admin/products">Products</Link></li>
        <li><Link href="/admin/products/create">Create Product</Link></li>

        {/* Settings Dropdown */}
        <li 
          onMouseEnter={() => setShowDropdown(true)} 
          onMouseLeave={() => setShowDropdown(false)} 
          style={{ position: 'relative', cursor: 'pointer' }}
        >
          Settings
          {showDropdown && (
            <ul style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              backgroundColor: '#fff',
              boxShadow: '0 0 5px rgba(0,0,0,0.3)',
              listStyle: 'none',
              padding: '10px 0',
              margin: 0,
              minWidth: 150,
            }}>
              <li style={{ padding: '5px 20px' }}>
                <Link href="/admin/profile">Profile</Link>
              </li>
              <li style={{ padding: '5px 20px', cursor: 'pointer' }} onClick={handleLogout}>
                Logout
              </li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
}

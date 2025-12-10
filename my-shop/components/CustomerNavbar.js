import { useState } from 'react';
import { useRouter } from 'next/router';
import { useCustomer } from '../context/CustomerContext';
import Link from 'next/link';

export default function CustomerNavbar() {
  const router = useRouter();
  const { cart, favorites } = useCustomer();
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const categories = ['All Products', 'Electronics', 'Clothing', 'Books', 'Beauty', 'Other'];

  const handleCategoryClick = (category) => {
    const queryCategory = category === 'All Products' ? 'All' : category;
    router.push(`/shop/categories?category=${queryCategory}`);
    setCategoryOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('customerToken');
    router.push('/shop/login');
  };

  return (
    <nav style={{ padding: 10, background: '#333', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
      <ul style={{ display: 'flex', gap: 20, listStyle: 'none', margin: 0 }}>
        <li><Link href="/shop" style={{ color: '#fff' }}>Home</Link></li>
        <li style={{ position: 'relative' }}>
          <span onClick={() => setCategoryOpen(!categoryOpen)} style={{ cursor: 'pointer' }}>Category ▾</span>
          {categoryOpen && (
            <ul style={{ position: 'absolute', top: '100%', left: 0, background: '#fff', color: '#000', padding: 10, listStyle: 'none', border: '1px solid #ccc' }}>
              {categories.map(cat => (
                <li key={cat} style={{ padding: '5px 0', cursor: 'pointer' }} onClick={() => handleCategoryClick(cat)}>{cat}</li>
              ))}
            </ul>
          )}
        </li>
        <li><Link href="/shop/about" style={{ color: '#fff' }}>About</Link></li>
      </ul>

      {/* Favorites & Cart */}
      <ul style={{ display: 'flex', gap: 15, listStyle: 'none', margin: 0 }}>
        <li style={{ cursor: 'pointer' }} onClick={() => router.push('/shop/favorites')}>Favorites ({favorites.length})</li>
        <li style={{ cursor: 'pointer' }} onClick={() => router.push('/shop/cart')}>Cart ({cart.length})</li>
      
        {/* Settings dropdown */}
        <li style={{ position: 'relative' }}>
          <span onClick={() => setSettingsOpen(!settingsOpen)} style={{ cursor: 'pointer' }}>Settings ▾</span>
          {settingsOpen && (
            <ul style={{ position: 'absolute', top: '100%', left: 0, background: '#fff', color: '#000', padding: 10, listStyle: 'none', border: '1px solid #ccc' }}>
              <li style={{ padding: '5px 0', cursor: 'pointer' }} onClick={() => { router.push('/shop/profile'); setSettingsOpen(false); }}>Profile</li>
              <li style={{ padding: '5px 0', cursor: 'pointer' }} onClick={() => { router.push('/shop/purchase/history'); setSettingsOpen(false); }}>Purchase History</li>
              <li style={{ padding: '5px 0', cursor: 'pointer' }} onClick={handleLogout}>Logout</li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
}

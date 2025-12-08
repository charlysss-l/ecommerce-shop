import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { useCustomer } from '../context/CustomerContext';
import Link from 'next/link';

export default function CustomerNavbar() {
  const router = useRouter();
  const { cart, favorites } = useCustomer();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const categories = ['All Products', 'Electronics', 'Clothing', 'Books', 'Beauty', 'Other'];

  const handleCategoryClick = (category) => {
    const queryCategory = category === 'All Products' ? 'All' : category;
    router.push(`/shop/categories?category=${queryCategory}`);
    setDropdownOpen(false);
  };

  return (
    <nav style={{ padding: 10, background: '#333', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
      <ul style={{ display: 'flex', gap: 20, listStyle: 'none', margin: 0 }}>
        <li><Link href="/shop" style={{ color: '#fff' }}>Home</Link></li>
        <li style={{ position: 'relative' }}>
          <span onClick={() => setDropdownOpen(!dropdownOpen)} style={{ cursor: 'pointer' }}>Category ▾</span>
          {dropdownOpen && (
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
      </ul>
    </nav>
  );
}

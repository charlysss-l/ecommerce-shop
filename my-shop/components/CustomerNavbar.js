import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function CustomerNavbar() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const categories = ['All Products', 'Electronics', 'Clothing', 'Books', 'Beauty', 'Other'];

  const handleCategoryClick = (category) => {
    // Convert "All Products" to query "All" for consistency
    const queryCategory = category === 'All Products' ? 'All' : category;
    router.push(`/shop/categories?category=${queryCategory}`);
    setDropdownOpen(false);
  };

  return (
    <nav style={{ padding: '10px 20px', background: '#333', color: '#fff', position: 'relative' }}>
      <ul style={{ display: 'flex', gap: '20px', listStyle: 'none', margin: 0, padding: 0, alignItems: 'center' }}>
        <li>
          <Link href="/shop" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
        </li>

        {/* Category Dropdown */}
        <li style={{ position: 'relative' }}>
          <span
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{ cursor: 'pointer', color: '#fff' }}
          >
            Category ▾
          </span>

          {dropdownOpen && (
            <ul style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              background: '#fff',
              color: '#000',
              padding: 10,
              listStyle: 'none',
              margin: 0,
              border: '1px solid #ccc',
              minWidth: 150,
              zIndex: 100
            }}>
              {categories.map(cat => (
                <li
                  key={cat}
                  style={{ padding: '5px 0', cursor: 'pointer' }}
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat}
                </li>
              ))}
            </ul>
          )}
        </li>

        <li>
          <Link href="/shop/about" style={{ color: '#fff', textDecoration: 'none' }}>About</Link>
        </li>
      </ul>
    </nav>
  );
}

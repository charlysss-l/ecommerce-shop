import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CustomerNavbar from '../../components/CustomerNavbar';

export default function Categories() {
  const router = useRouter();
  const { category } = router.query; // read query from URL
  const [products, setProducts] = useState([]);

  const categories = ['All', 'Electronics', 'Clothing', 'Books', 'Beauty', 'Other'];

  // Fetch all products whenever the URL query changes
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const json = await res.json();
        if (json.success) {
          const filtered = category && category !== 'All'
            ? json.data.filter(p => p.category === category)
            : json.data;
          setProducts(filtered);
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchProducts();
  }, [category]); // <- dependency is router.query.category

  return (
    <div>
      <CustomerNavbar />

      <div style={{ padding: 20 }}>
        <h1>Categories</h1>

        <label>
          Select Category:{' '}
          <select
            value={category || 'All'}
            onChange={e => router.push(`/shop/categories?category=${e.target.value}`)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>

        <div style={{ marginTop: 20 }}>
          {products.length === 0 && <p>No products found.</p>}

          {products.map(p => (
            <div key={p._id} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
              <p><strong>{p.title}</strong></p>
              <p>Price: ${p.price}</p>
              <button style={{ marginRight: 10 }}>Add to Favorite</button>
              <button style={{ marginRight: 10 }}>Add to Cart</button>
              <button>View Details</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

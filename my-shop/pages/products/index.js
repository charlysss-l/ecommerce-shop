import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';

export default function ProductsList() {
  const [products, setProducts] = useState([]);

  async function fetchProducts() {
    const res = await fetch('/api/products');
    const json = await res.json();
    if (json.success) setProducts(json.data);
  }

  useEffect(() => { fetchProducts(); }, []);

  return (
    <>
      <Navbar />

      <div style={{ padding: 20 }}>
        <h1>All Products</h1>

        <a href="/products/create" style={{ color: "blue" }}>
          + Create New Product
        </a>

        <ul style={{ marginTop: 20 }}>
          {products.map(p => (
            <li key={p._id}>
              <a href={`/products/${p._id}`}>{p.title} — ${p.price}</a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

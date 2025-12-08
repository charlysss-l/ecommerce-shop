import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import styles from './products.module.css';

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [filterCategory, setFilterCategory] = useState('All');

  const categories = ['All', 'Electronics', 'Clothing', 'Books', 'Beauty', 'Other'];

  async function fetchProducts() {
    const res = await fetch('/api/products');
    const json = await res.json();
    if (json.success) setProducts(json.data);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = filterCategory === 'All'
    ? products
    : products.filter(p => p.category === filterCategory);

  return (
    <>
      <Navbar />

      <div className={styles.container}>
        <h1 className={styles.title}>All Products</h1>

        <a href="/products/create" className={styles.link}>
          + Create New Product
        </a>

        <div className={styles.filter}>
          <label>
            Filter by Category:{' '}
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </label>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(p => (
              <tr key={p._id}>
                <td><a href={`/products/${p._id}`}>{p.title}</a></td>
                <td>${p.price}</td>
                <td>{p.category || 'No Category'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

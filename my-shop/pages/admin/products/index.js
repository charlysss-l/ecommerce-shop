import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import styles from './products.module.css';
import ProtectedAdmin from '../../../components/ProtectedAdmin';

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [filterCategory, setFilterCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const categories = ['All', 'Electronics', 'Clothing', 'Books', 'Beauty', 'Other'];

  async function fetchProducts() {
    try {
      const res = await fetch('/api/products');
      const json = await res.json();
      if (json.success) setProducts(json.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = filterCategory === 'All'
    ? products
    : products.filter(p => p.category === filterCategory);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <ProtectedAdmin>
      <Navbar />

      <div className={styles.container}>
        <h1 className={styles.title}>All Products</h1>

        <Link href="/admin/products/create" className={styles.link}>
          + Create New Product
        </Link>

        <div className={styles.filter}>
          <label>
            Filter by Category:{' '}
            <select
              value={filterCategory}
              onChange={e => {
                setFilterCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </label>
        </div>

        {paginatedProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map(p => (
                <tr key={p._id}>
                  <td>
                    <Link href={`/admin/products/${p._id}`}>{p.title}</Link>
                  </td>
                  <td>${p.price}</td>
                  <td>{p.category || 'No Category'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {totalPages > 1 && (
          <div style={{ marginTop: 20 }}>
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
              Prev
            </button>

            <span style={{ margin: '0 10px' }}>
              Page {currentPage} of {totalPages}
            </span>

            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        )}
      </div>
    </ProtectedAdmin>
  );
}

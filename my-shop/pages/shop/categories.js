import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CustomerNavbar from '../../components/CustomerNavbar';
import { useCustomer } from '../../context/CustomerContext';

export default function Categories() {
  const router = useRouter();
  const { category } = router.query;
  const { cart, favorites, addToCart, addToFavorites } = useCustomer();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const categories = ['All', 'Electronics', 'Clothing', 'Books', 'Beauty', 'Other'];

  // Fetch products whenever the category changes
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
          setCurrentPage(1); // reset pagination
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchProducts();
  }, [category]);

  // Pagination logic
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const displayedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  // Handle Add to Cart & Favorite with async DB call
  const handleAddToCart = async (product) => {
    await addToCart(product);
  };

  const handleAddToFavorites = async (product) => {
    await addToFavorites(product);
  };

  return (
    <>
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
          {displayedProducts.length === 0 && <p>No products found.</p>}

          {displayedProducts.map(p => (
            <div key={p._id} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
              <p><strong>{p.title}</strong></p>
              <p>Price: ${p.price}</p>
              <button
                style={{ marginRight: 10 }}
                onClick={() => handleAddToFavorites(p)}
              >
                Add to Favorite
              </button>
              <button
                style={{ marginRight: 10 }}
                onClick={() => handleAddToCart(p)}
              >
                Add to Cart
              </button>
              <button onClick={() => router.push(`/shop/details/${p._id}`)}>
                View Details
              </button>
            </div>
          ))}

          {totalPages > 1 && (
            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              <button onClick={handlePrev} disabled={currentPage === 1}>Prev</button>
              <span>Page {currentPage} of {totalPages}</span>
              <button onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

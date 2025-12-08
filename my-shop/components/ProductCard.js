import { useContext } from 'react';
import { CustomerContext } from '../context/CustomerContext';
import { useRouter } from 'next/router';

export default function ProductCard({ product }) {
  const { addToFavorites, addToCart } = useContext(CustomerContext);
  const router = useRouter();

  return (
    <div style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
      <p><strong>{product.title}</strong></p>
      <p>Price: ${product.price}</p>
      <p>Category: {product.category}</p>
      <button onClick={() => addToFavorites(product)} style={{ marginRight: 10 }}>Add to Favorite</button>
      <button onClick={() => addToCart(product)} style={{ marginRight: 10 }}>Add to Cart</button>
      <button onClick={() => router.push(`/shop/details/${product._id}`)}>View Details</button>
    </div>
  );
}

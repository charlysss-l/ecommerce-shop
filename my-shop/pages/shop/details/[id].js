import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import CustomerNavbar from '../../../components/CustomerNavbar';
import { CustomerContext } from '../../../context/CustomerContext';

export default function Details() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const { addToFavorites, addToCart } = useContext(CustomerContext);

  useEffect(() => {
    if (!id) return;
    async function fetchProduct() {
      const res = await fetch(`/api/products/${id}`);
      const json = await res.json();
      if (json.success) setProduct(json.data);
    }
    fetchProduct();
  }, [id]);

  if (!product) return <CustomerNavbar />; // simple loading

  return (
    <div>
      <CustomerNavbar />
      <div style={{ padding: 20 }}>
        <h1>{product.title}</h1>
        <p>{product.description}</p>
        <p>Price: ${product.price}</p>
        <p>Category: {product.category}</p>
        <button onClick={() => addToFavorites(product)} style={{ marginRight: 10 }}>Add to Favorite</button>
        <button onClick={() => addToCart(product)}>Add to Cart</button>
      </div>
    </div>
  );
}

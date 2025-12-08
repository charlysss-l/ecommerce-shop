import { useContext } from 'react';
import CustomerNavbar from '../../components/CustomerNavbar';
import { CustomerContext } from '../../context/CustomerContext';
import ProductCard from '../../components/ProductCard';

export default function Favorites() {
  const { favorites } = useContext(CustomerContext);

  return (
    <div>
      <CustomerNavbar />
      <div style={{ padding: 20 }}>
        <h1>Favorites</h1>
        {favorites.length === 0 && <p>No favorite products yet.</p>}
        {favorites.map(p => <ProductCard key={p._id} product={p} />)}
      </div>
    </div>
  );
}

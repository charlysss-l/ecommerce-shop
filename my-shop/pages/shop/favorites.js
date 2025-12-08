import { useCustomer } from '../../context/CustomerContext';
import CustomerNavbar from '../../components/CustomerNavbar';

export default function FavoritesPage() {
  const { favorites, removeFromFavorites } = useCustomer();

  return (
    <>
      <CustomerNavbar />
      <div style={{ padding: 20 }}>
        <h1>My Favorites</h1>
        {favorites.length === 0 && <p>No favorite products.</p>}
        {favorites.map(p => (
          <div key={p._id} style={{ borderBottom: '1px solid #ccc', marginBottom: 10, paddingBottom: 10 }}>
            <p><strong>{p.title}</strong></p>
            <p>Price: ${p.price}</p>
            <button onClick={() => removeFromFavorites(p._id)}>Remove from Favorites</button>
          </div>
        ))}
      </div>
    </>
  );
}

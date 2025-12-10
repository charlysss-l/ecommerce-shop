import { useCustomer } from '../../context/CustomerContext';
import CustomerNavbar from '../../components/CustomerNavbar';
import ProtectedCustomer from '../../components/ProtectedCustomer';

export default function FavoritesPage() {
  const { favorites, removeFromFavorites } = useCustomer();

  return (
    <ProtectedCustomer>
      <CustomerNavbar />
      <div style={{ padding: 20 }}>
        <h1>My Favorites</h1>
        {favorites.length === 0 && <p>No favorite products.</p>}
        {favorites.map(p => (
          <div
            key={p._id}
            style={{ borderBottom: '1px solid #ccc', marginBottom: 10, paddingBottom: 10 }}
          >
            {p.image && (
              <img
                src={p.image}
                alt={p.title}
                style={{ width: 100, height: 100, objectFit: 'cover', marginBottom: 5 }}
              />
            )}
            <p><strong>{p.title}</strong></p>
            <p>Price: ${p.price}</p>
            <button onClick={() => removeFromFavorites(p._id)}>
              Remove from Favorites
            </button>
          </div>
        ))}
      </div>
    </ProtectedCustomer>
  );
}

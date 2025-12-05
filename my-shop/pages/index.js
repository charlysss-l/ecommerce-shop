export default function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome to My Shop</h1>
      <p>This is your homepage.</p>

      <a href="/products" style={{ color: 'blue', textDecoration: 'underline' }}>
        Go to Products CRUD
      </a>
    </div>
  );
}

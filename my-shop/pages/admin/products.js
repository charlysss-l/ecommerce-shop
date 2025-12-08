import ProtectedAdmin from '../../components/ProtectedAdmin';

export default function Products() {
  return (
    <ProtectedAdmin>
      <h1>Admin Products Page</h1>
      <p>Only visible after login.</p>
    </ProtectedAdmin>
  );
}

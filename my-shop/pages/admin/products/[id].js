import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../../components/Navbar';

const categories = ['Electronics', 'Clothing', 'Books', 'Beauty', 'Other'];

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', price: '', category: 'Electronics' });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(j => {
        if (j.success) {
          setProduct(j.data);
          setForm({
            title: j.data.title,
            description: j.data.description || '',
            price: j.data.price,
            category: j.data.category || 'Electronics',
          });
        }
      });
  }, [id]);

  async function handleUpdate(e) {
    e.preventDefault();
    setUploading(true);

    let imageUrl = product.image || '';

    if (imageFile) {
      try {
        const formData = new FormData();
        formData.append('file', imageFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadJson = await uploadRes.json();
        if (!uploadJson.success) throw new Error('Image upload failed');
        imageUrl = uploadJson.url;
      } catch (err) {
        setUploading(false);
        return alert('Image upload failed: ' + err.message);
      }
    }

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: Number(form.price), image: imageUrl }),
      });

      const json = await res.json();
      setUploading(false);

      if (json.success) {
        alert('Product updated!');
        router.push('/admin/products');
      } else {
        alert(json.error || 'Update failed');
      }
    } catch (err) {
      setUploading(false);
      alert('Request failed: ' + err.message);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this product?')) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) router.push('/admin/products');
    else alert(json.error || 'Delete failed');
  }

  if (!product) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div style={{ padding: 20 }}>
        <h1>{product.title}</h1>
        {product.image && (
          <img
            src={product.image}
            alt={product.title}
            style={{ width: 200, height: 200, objectFit: 'cover', marginBottom: 10 }}
          />
        )}
        <p>{product.description}</p>
        <p>${product.price}</p>
        <p>Category: {product.category}</p>

        <button onClick={() => setEditing(!editing)}>{editing ? 'Cancel' : 'Edit'}</button>
        <button onClick={handleDelete} style={{ marginLeft: 8 }}>Delete</button>

        {editing && (
          <form
            onSubmit={handleUpdate}
            style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            <label>
              Title:
              <input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
              />
            </label>

            <label>
              Description:
              <input
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </label>

            <label>
              Price:
              <input
                type="number"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                required
              />
            </label>

            <label>
              Category:
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </label>

            <label>
              Image:
              <input
                type="file"
                accept="image/*"
                onChange={e => setImageFile(e.target.files[0])}
              />
            </label>

            <button type="submit" disabled={uploading}>
              {uploading ? 'Updating...' : 'Save'}
            </button>
          </form>
        )}
      </div>
    </>
  );
}

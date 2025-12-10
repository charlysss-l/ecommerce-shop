import { useState } from 'react';
import Navbar from '../../../components/Navbar';
import ProtectedAdmin from '../../../components/ProtectedAdmin';

const categories = ['Electronics', 'Clothing', 'Books', 'Beauty', 'Other'];

export default function CreateProduct() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Electronics', // default
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function handleCreate(e) {
    e.preventDefault();
    setUploading(true);

    let imageUrl = '';

    // 1️⃣ Upload image to Cloudinary
    if (imageFile) {
      try {
        const formData = new FormData();
        formData.append('file', imageFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        // Make sure API returns proper JSON
        if (!uploadRes.ok) {
          const text = await uploadRes.text();
          throw new Error('Upload failed: ' + text);
        }

        const uploadJson = await uploadRes.json();
        if (!uploadJson.success) throw new Error(uploadJson.error || 'Image upload failed');
        imageUrl = uploadJson.url;
      } catch (err) {
        setUploading(false);
        return alert('Image upload failed: ' + err.message);
      }
    }

    // 2️⃣ Create product in MongoDB
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: Number(form.price), image: imageUrl }),
      });

      const json = await res.json();
      setUploading(false);

      if (json.success) {
        alert('Product created!');
        setForm({ title: '', description: '', price: '', category: 'Electronics' });
        setImageFile(null);
        window.location.href = '/admin/products';
      } else {
        alert(json.error || 'Create failed');
      }
    } catch (err) {
      setUploading(false);
      alert('Request failed: ' + err.message);
    }
  }

  return (
    <ProtectedAdmin>
      <Navbar />
      <div style={{ padding: 20 }}>
        <h1>Create Product</h1>
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Image input */}
          <input
            type="file"
            accept="image/*"
            onChange={e => setImageFile(e.target.files[0])}
          />
          {/* Title */}
          <input
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
          />
          {/* Description */}
          <input
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
          {/* Price */}
          <input
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
            required
          />
          {/* Category */}
          <select
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            required
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {/* Submit button */}
          <button type="submit" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Create Product'}
          </button>
        </form>
      </div>
    </ProtectedAdmin>
  );
}

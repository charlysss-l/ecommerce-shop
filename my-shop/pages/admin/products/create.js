import { useState } from 'react';
import Navbar from '../../../components/Navbar';
import ProtectedAdmin from '../../../components/ProtectedAdmin';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../../lib/firebase';

const categories = ['Electronics', 'Clothing', 'Books', 'Beauty', 'Other'];

export default function CreateProduct() {
  const [imageFile, setImageFile] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Electronics', 
  });
  const [uploading, setUploading] = useState(false); // optional: show upload progress

  async function handleCreate(e) {
    e.preventDefault();
    setUploading(true);

    let imageUrl = '';
    if (imageFile) {
      try {
        const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        imageUrl = await new Promise((resolve, reject) => {
          uploadTask.on('state_changed',
            null,
            error => reject(error),
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            }
          );
        });
      } catch (err) {
        setUploading(false);
        alert('Image upload failed: ' + err.message);
        return;
      }
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          price: Number(form.price),
          category: form.category,
          image: imageUrl,
        }),
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
          <input
            type="file"
            accept="image/*"
            onChange={e => setImageFile(e.target.files[0])}
          />
          <input
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
          <input
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
            required
          />
          <select
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            required
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button type="submit" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Create Product'}
          </button>
        </form>
      </div>
    </ProtectedAdmin>
  );
}

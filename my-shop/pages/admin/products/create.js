import { useState } from 'react';
import Navbar from '../../../components/Navbar';

const categories = ['Electronics', 'Clothing', 'Books', 'Beauty', 'Other'];

export default function CreateProduct() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Electronics', // default
  });

  async function handleCreate(e) {
    e.preventDefault();

    // Make sure category is sent
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        price: Number(form.price),
        category: form.category, 
      }),
    });

    const json = await res.json();
    if (json.success) {
      alert('Product created!');
      setForm({ title: '', description: '', price: '', category: 'Electronics' });
      window.location.href = '/admin/products'; // redirect to products list
    } else {
      alert(json.error || 'Create failed');
    }
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: 20 }}>
        <h1>Create Product</h1>
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
          <button type="submit">Create Product</button>
        </form>
      </div>
    </>
  );
}

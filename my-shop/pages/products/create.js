import { useState } from 'react';
import Navbar from '../../components/Navbar';

export default function CreateProduct() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Electronics', 
  });

  const categories = ['Electronics', 'Clothing', 'Books', 'Beauty', 'Other']; // your options

  async function handleCreate(e) {
    e.preventDefault();

    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        price: Number(form.price)
      }),
    });

    const json = await res.json();
    if (json.success) {
      alert('Product created!');
      setForm({ title: '', description: '', price: '', category: 'Electronics' });
      window.location.href = '/products';
    } else {
      alert(json.error || 'Create failed');
    }
  }

  return (
    <>
      <Navbar />

      <div style={{ padding: 20 }}>
        <h1>Create Product</h1>

        <form onSubmit={handleCreate} style={{ marginTop: 20 }}>
          <input
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
          />
          <br /><br />

          <input
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
          <br /><br />

          <input
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
            required
          />
          <br /><br />

          <label>
            Category:{' '}
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </label>
          <br /><br />

          <button type="submit">Create</button>
        </form>
      </div>
    </>
  );
}

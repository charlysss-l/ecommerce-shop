import { useState, useEffect } from 'react';


export default function ProductsPage() {
const [products, setProducts] = useState([]);
const [form, setForm] = useState({ title: '', description: '', price: '' });


async function fetchProducts() {
    const res = await fetch('/api/products');
    const json = await res.json();
    if (json.success) setProducts(json.data);
}


useEffect(() => { fetchProducts(); }, []);


async function handleCreate(e) {
    e.preventDefault();
    const res = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...form, price: Number(form.price) }),
});
const json = await res.json();
    if (json.success) {
    setForm({ title: '', description: '', price: '' });
    fetchProducts();
    } else alert(json.error || 'Create failed');
}


return (
<div style={{ padding: 20 }}>
    <h1>Products</h1>
    <form onSubmit={handleCreate} style={{ marginBottom: 20 }}>
        <input placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
        <input placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
        <input placeholder="Price" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} required />
        <button type="submit">Create</button>
    </form>


<ul>
    {products.map(p => (
    <li key={p._id}>
    <a href={`/products/${p._id}`}>{p.title} — ${p.price}</a>
    </li>
    ))}
</ul>
</div>
);
}
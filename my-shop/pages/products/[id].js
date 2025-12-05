import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';


export default function ProductPage() {
const router = useRouter();
const { id } = router.query;
const [product, setProduct] = useState(null);
const [editing, setEditing] = useState(false);
const [form, setForm] = useState({ title: '', description: '', price: '' });


useEffect(() => {
    if (!id) return;
    fetch(`/api/products/${id}`).then(r => r.json()).then(j => { if (j.success) { setProduct(j.data); setForm({ title: j.data.title, description: j.data.description || '', price: j.data.price }); } });
    }, [id]
);


async function handleUpdate(e) {
    e.preventDefault();
    const res = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...form, price: Number(form.price) }),
    });
    const json = await res.json();
    if (json.success) { setProduct(json.data); setEditing(false); } else alert(json.error || 'Update failed');
}


async function handleDelete() {
    if (!confirm('Delete this product?')) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) router.push('/products'); else alert(json.error || 'Delete failed');
}


if (!product) return <div>Loading...</div>;


return (
<div style={{ padding: 20 }}>
    <h1>{product.title}</h1>
    <p>{product.description}</p>
    <p>${product.price}</p>
    <button onClick={() => setEditing(!editing)}>{editing ? 'Cancel' : 'Edit'}</button>
    <button onClick={handleDelete} style={{ marginLeft: 8 }}>Delete</button>


{editing && (
    <form onSubmit={handleUpdate} style={{ marginTop: 20 }}>
    <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
    <input value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
    <input value={form.price} onChange={e=>setForm({...form, price:e.target.value})} required />
    <button type="submit">Save</button>
    </form>
)}
</div>
);
}
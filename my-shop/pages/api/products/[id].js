import dbConnect from '../../../lib/mongodb';
import Product from '../../../models/Product';


export default async function handler(req, res) {
await dbConnect();
const { method } = req;
const { id } = req.query;


if (method === 'GET') {
    try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false });
    return res.status(200).json({ success: true, data: product });
    } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
    }
}


if (method === 'PUT') {
    try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    });
    if (!product) return res.status(404).json({ success: false });
    return res.status(200).json({ success: true, data: product });
    } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
    }
}


if (method === 'DELETE') {
    try {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false });
    return res.status(200).json({ success: true, data: {} });
    } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
    }
}


res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
res.status(405).end(`Method ${method} Not Allowed`);
}
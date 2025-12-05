import dbConnect from '../../../lib/mongodb';
import Product from '../../../models/Product';


export default async function handler(req, res) {
await dbConnect();
const { method } = req;


if (method === 'GET') {
    try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: products });
    } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
    }
}


if (method === 'POST') {
    try {
    const product = await Product.create(req.body);
    return res.status(201).json({ success: true, data: product });
    } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
    }
}


res.setHeader('Allow', ['GET', 'POST']);
res.status(405).end(`Method ${method} Not Allowed`);
}
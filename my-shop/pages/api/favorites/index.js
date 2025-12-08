import dbConnect from '../../../lib/mongodb';
import Favorite from '../../../models/Favorite';

export default async function handler(req, res) {
  await dbConnect();
  const { method } = req;
  const { userId, productId } = req.body || req.query;

  if (!userId) return res.status(400).json({ success: false, error: 'No userId provided' });

  if (method === 'GET') {
    try {
      const fav = await Favorite.findOne({ userId }).populate('products');
      return res.status(200).json({ success: true, data: fav || { products: [] } });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (method === 'POST') {
    try {
      let fav = await Favorite.findOne({ userId });
      if (!fav) fav = await Favorite.create({ userId, products: [] });

      if (!fav.products.includes(productId)) fav.products.push(productId);
      await fav.save();
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (method === 'DELETE') {
    try {
      const fav = await Favorite.findOne({ userId });
      if (!fav) return res.status(404).json({ success: false });

      fav.products = fav.products.filter(p => p.toString() !== productId);
      await fav.save();
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  res.status(405).end(`Method ${method} Not Allowed`);
}

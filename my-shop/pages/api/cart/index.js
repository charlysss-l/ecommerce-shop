import dbConnect from '../../../lib/mongodb';
import Cart from '../../../models/Cart';

export default async function handler(req, res) {
  await dbConnect();
  const { method } = req;
  const { userId, productId, quantity } = req.body || req.query;

  if (!userId) return res.status(400).json({ success: false, error: 'No userId provided' });

  if (method === 'GET') {
    try {
      const cart = await Cart.findOne({ userId }).populate('items.productId');
      return res.status(200).json({ success: true, data: cart || { items: [] } });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (method === 'POST') {
    // Add product or increment quantity
    try {
      let cart = await Cart.findOne({ userId });
      if (!cart) cart = await Cart.create({ userId, items: [] });

      const itemIndex = cart.items.findIndex(i => i.productId.toString() === productId);
      if (itemIndex >= 0) {
        cart.items[itemIndex].quantity += 1;
      } else {
        cart.items.push({ productId, quantity: 1 });
      }

      await cart.save();
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (method === 'PUT') {
    // Update quantity
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) return res.status(404).json({ success: false });

      const itemIndex = cart.items.findIndex(i => i.productId.toString() === productId);
      if (itemIndex >= 0) {
        if (quantity <= 0) cart.items.splice(itemIndex, 1);
        else cart.items[itemIndex].quantity = quantity;
        await cart.save();
      }
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (method === 'DELETE') {
    // Remove product
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) return res.status(404).json({ success: false });

      cart.items = cart.items.filter(i => i.productId.toString() !== productId);
      await cart.save();
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${method} Not Allowed`);
}

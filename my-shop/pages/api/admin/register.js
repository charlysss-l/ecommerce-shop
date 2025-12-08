import dbConnect from '../../../lib/dbConnect';
import Admin from '../../../models/Admin';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
      const exists = await Admin.findOne({ email });
      if (exists) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
      }

      const admin = await Admin.create({ name, email, password });
      return res.status(201).json({ success: true, data: admin });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

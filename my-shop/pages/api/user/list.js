import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/Users';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'GET') return res.status(405).json({ success: false, message: 'Method not allowed' });

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden' });

    const users = await User.find().select('-password -__v'); // exclude password & version

    res.status(200).json({ success: true, users });
  } catch (err) {
    console.error(err);
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

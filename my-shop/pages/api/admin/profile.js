// pages/api/admin/profile.js
import dbConnect from '../../../lib/dbConnect';
import Admin from '../../../models/Admin';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-__v'); // exclude version key

    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    res.status(200).json({
      name: admin.name,
      email: admin.email,
      password: admin.password, // optional: can be masked if needed
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid token' });
  }
}

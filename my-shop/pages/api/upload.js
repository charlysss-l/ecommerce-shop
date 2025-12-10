import multer from 'multer';
import cloudinary from '../../lib/cloudinary';
import { Readable } from 'stream';

// Initialize multer
const upload = multer();

export const config = {
  api: {
    bodyParser: false, // important
  },
};

// Helper to wrap handler
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  upload.single('file')(req, {}, async err => {
    if (err) return res.status(400).json({ success: false, error: err.message });

    if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });

    try {
      // Convert buffer to stream
      const bufferStream = new Readable();
      bufferStream.push(req.file.buffer);
      bufferStream.push(null);

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'products' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        bufferStream.pipe(stream);
      });

      res.status(200).json({ success: true, url: result.secure_url });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
}

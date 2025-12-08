import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Favorite || mongoose.model('Favorite', FavoriteSchema);

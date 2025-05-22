import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  condition: String,
  desiredItems: [String],
  available: { type: Boolean, default: true },
  price: Number
});

export default mongoose.model('Item', itemSchema);

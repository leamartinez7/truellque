// === models/Trade.js ===
import mongoose from 'mongoose';

const tradeSchema = new mongoose.Schema({
  itemOffered: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  itemRequested: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model('Trade', tradeSchema);
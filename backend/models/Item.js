
// === models/Item.js ===
import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  uso: { type: String }, // Ej: "como nuevo", "con uso"
  image: { type: String }, // puede ser una URL o base64
  price: { type: Number }, // opcional, pero podés dejarlo
  location: { type: String }, // ahora vendrá del usuario
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });


export default mongoose.model('Item', itemSchema);

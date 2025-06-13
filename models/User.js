// === models/User.js ===
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String }, // para geolocalización futura
}, { timestamps: true });

export default mongoose.model('User', userSchema);
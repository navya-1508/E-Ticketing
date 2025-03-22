import mongoose from "mongoose";

const busSchema = new mongoose.Schema({
  name: String,
  from: String,
  to: String,
  date: String,
  price: Number,
  time: String
});

const Bus = mongoose.model("Bus", busSchema);
export default Bus; // ✅ Ensure default export

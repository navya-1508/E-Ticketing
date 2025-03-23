import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    busId: Number,
    busName: String,
    userId: mongoose.Schema.Types.ObjectId, // Store user reference if logged in
    seats: [Number], // Array of selected seat numbers
    totalAmount: Number,
    paymentStatus: { type: String, default: "Pending" }
});

export default mongoose.model("Booking", bookingSchema);

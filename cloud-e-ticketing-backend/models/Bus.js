import mongoose from "mongoose";

const BusSchema = new mongoose.Schema({
    name: String,
    from: String,
    to: String,
    date: String,
    price: Number,
    seatsAvailable: Number,
});

export default mongoose.model("Bus", BusSchema);

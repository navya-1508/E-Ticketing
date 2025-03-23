import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import Booking from "./models/Booking.js"; // Import Booking Model
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ MongoDB Connection Handling
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Reduce timeout to detect DB issues early
        });
        console.log("✅ MongoDB Connected");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err.message);
        process.exit(1); // Exit if DB connection fails
    }
};
connectDB();

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ✅ Logging Middleware
app.use((req, res, next) => {
    console.log(`🔍 Incoming Request: ${req.method} ${req.url}`);
    next();
});

// ✅ Authentication Routes
app.use("/api/auth", authRoutes);

// ✅ Serve Frontend Files
const __dirname = path.resolve();
const frontendPath = path.join(__dirname, "../cloud-front");
app.use(express.static(frontendPath));

app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});
app.post("/api/search-buses", (req, res) => {
    const { from, to, date } = req.body;

    console.log("🔍 Received Search Request:", { from, to, date }); // ✅ Log received request

    const buses = [
        { id: 1, name: "Super Deluxe", from: "Hyderabad", to: "Mumbai", date: "2025-03-22", price: 1200 },
        { id: 2, name: "Express", from: "Bangalore", to: "Chennai", date: "2025-03-23", price: 800 },
    ];

    console.log("🗂️ Bus Data in DB:", buses); // ✅ Log available bus data

    const availableBuses = buses.filter(
        (bus) => bus.from === from && bus.to === to && bus.date === date
    );

    console.log("🚍 Found Buses:", availableBuses); // ✅ Log filtered buses

    res.json(availableBuses);
});



// ✅ Catch-All Route for Frontend Pages
app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});


// ✅ API to Book Seats
app.post("/api/book-seat", async (req, res) => {
    const { busId, busName, seats, totalAmount } = req.body;

    try {
        const newBooking = new Booking({ busId, busName, seats, totalAmount });
        await newBooking.save();

        res.json({ success: true, message: "Booking successful!", bookingId: newBooking._id });
    } catch (error) {
        console.error("❌ Booking Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
app.post("/api/payment", async (req, res) => {
    const { bookingId } = req.body;

    try {
        await Booking.findByIdAndUpdate(bookingId, { paymentStatus: "Paid" });

        res.json({ success: true, message: "Payment successful!" });
    } catch (error) {
        console.error("❌ Payment Error:", error);
        res.status(500).json({ success: false, message: "Payment Failed" });
    }
});

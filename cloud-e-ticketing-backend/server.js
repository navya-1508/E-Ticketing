import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";

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

// ✅ API Route for Searching Buses
app.post("/api/search-buses", (req, res) => {
    const { from, to, date } = req.body;

    const buses = [
        { id: 1, name: "Super Deluxe", from: "Hyderabad", to: "Mumbai", date: "2025-03-22", price: 1200 },
        { id: 2, name: "Express", from: "Bangalore", to: "Chennai", date: "2025-03-23", price: 800 },
    ];

    const availableBuses = buses.filter(
        (bus) => bus.from === from && bus.to === to && bus.date === date
    );

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
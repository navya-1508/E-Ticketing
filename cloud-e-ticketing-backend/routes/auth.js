import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

// ✅ Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log("🔹 Login Attempt:", email, password);  // Log request

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            console.log("❌ User Not Found");
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Compare Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ Password Incorrect");
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        console.log("✅ Login Successful!");
        res.json({ message: "Login successful!", user });
    } catch (err) {
        console.error("❌ Server Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Signup Route
router.post("/signup", async (req, res) => {
    const { email, password } = req.body;
    console.log("🔹 Signup Attempt:", email);  // Log request

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            console.log("❌ User Already Exists");
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("🔹 Hashed Password:", hashedPassword);

        // Create User
        user = new User({ email, password: hashedPassword });
        await user.save();

        console.log("✅ Signup Successful!");
        res.json({ message: "Signup successful!", user });
    } catch (err) {
        console.error("❌ Server Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;

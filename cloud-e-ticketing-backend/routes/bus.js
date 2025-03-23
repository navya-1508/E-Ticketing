import express from "express";
import Bus from "../models/Bus.js";

const router = express.Router();

// 🔍 Search Buses
router.post("/search", async (req, res) => {
    const { from, to, date } = req.body;
    try {
        const buses = await Bus.find({ from, to, date });
        res.json(buses);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;

import express from "express";
import Booking from "../models/Booking.js";
import Bus from "../models/Bus.js";

const router = express.Router();

// 🎟 Book a Ticket
router.post("/book", async (req, res) => {
    const { userId, busId, seatNumber } = req.body;
    try {
        const bus = await Bus.findById(busId);
        if (!bus || bus.seatsAvailable <= 0) {
            return res.status(400).json({ message: "No seats available" });
        }

        const booking = new Booking({ user: userId, bus: busId, seatNumber });
        await booking.save();

        bus.seatsAvailable -= 1;
        await bus.save();

        res.json({ message: "Booking Successful", booking });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;

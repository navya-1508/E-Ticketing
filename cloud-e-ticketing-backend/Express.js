const express = require("express");
const cors = require("cors"); 
const app = express();

app.use(express.json());
app.use(cors()); 

// Sample bus data
const buses = [
    { name: "ABC Travels", from: "Hyderabad", to: "Bangalore", date: "2025-03-25", time: "10:00 AM", price: "₹500" },
    { name: "XYZ Express", from: "Hyderabad", to: "Chennai", date: "2025-03-26", time: "12:30 PM", price: "₹700" },
    { name: "DEF Bus", from: "Bangalore", to: "Chennai", date: "2025-03-25", time: "06:00 PM", price: "₹450" }
];

app.post("/api/search-buses", (req, res) => {
    const { from, to, date } = req.body;

    const matchingBuses = buses.filter(bus => 
        bus.from.toLowerCase() === from.toLowerCase() && 
        bus.to.toLowerCase() === to.toLowerCase() && 
        bus.date === date
    );

    res.json(matchingBuses);
});

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));

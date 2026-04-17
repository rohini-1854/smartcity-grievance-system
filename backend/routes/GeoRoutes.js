// backend/routes/GeoRoutes.js
const express = require("express");
const router = express.Router();

// Node >= 18 has fetch built-in

router.get("/reverse-geocode", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Missing lat/lon parameters" });
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );

    if (!response.ok) {
      return res.status(500).json({ error: "Error fetching data from OSM" });
    }

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error during reverse geocoding" });
  }
});

module.exports = router; // ✅ Use CommonJS export

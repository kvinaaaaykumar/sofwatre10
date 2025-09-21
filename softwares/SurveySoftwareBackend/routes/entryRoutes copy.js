const express = require("express");
const Entry = require("../models/Entry");
const XLSX = require("xlsx");

const router = express.Router();

// Create new entry
router.post("/", async (req, res) => {
    try {
        const createDate = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
        const entry = new Entry({ ...req.body, createDate });
        await entry.save();
        res.json({ message: "✅ Entry created successfully", entry });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all entries
router.get("/", async (req, res) => {
    try {
        const entries = await Entry.find();
        res.json(entries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Edit entry
router.put("/:id", async (req, res) => {
    try {
        const updated = await Entry.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get stats
router.get("/stats", async (req, res) => {
    try {
        const today = new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });
        const allEntries = await Entry.find();
        const todayCount = allEntries.filter(e => e.createDate.includes(today)).length;
        res.json({ todayCount, totalCount: allEntries.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Download Excel
router.get("/download", async (req, res) => {
  try {
    const entries = await Entry.find();

    // Format data for Excel
    const formattedData = entries.map((e, index) => ({
      "S.No": index + 1,
      "Name": e.name,
      "Gender": e.age,
      "Address": e.address,
      "Purpose": e.purpose,
      "Mobile Number": e.mobileNumber,
      "Created By": e.createdBy,
      "Booking Date": new Date(e.appointmentDate).toLocaleDateString("en-IN"),
      "Create Date": new Date(e.createDate).toLocaleDateString("en-IN"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Entries");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=management_software.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;

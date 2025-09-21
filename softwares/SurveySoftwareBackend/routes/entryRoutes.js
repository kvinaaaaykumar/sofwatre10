const express = require("express");
const Entry = require("../models/Entry");
const XLSX = require("xlsx");

const router = express.Router();

// Create new entry
router.post("/", async (req, res) => {
  try {
    const createDate = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });
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
    const updated = await Entry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get stats
router.get("/stats", async (req, res) => {
  try {
    const today = new Date().toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
    });
    const allEntries = await Entry.find();
    const todayCount = allEntries.filter((e) =>
      e.createDate.includes(today)
    ).length;
    res.json({ todayCount, totalCount: allEntries.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Download Excel
router.get("/download", async (req, res) => {
  try {
    const entries = await Entry.find();

    const options = {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    // Format data for Excel
    const formattedData = entries.map((e, index) => ({
      "S.No": index + 1,
      Name: e.name,
      Gender: e.age,
      Address: e.address,
      // Survey Answers
      "Q1: उम्र": e.q1,
      "Q2: स्थान": e.q2,
      "Q3: शिक्षा": e.q3,
      "Q4: परिवार की आर्थिक हालत": e.q4,
      "Q5: राजनीति में रुचि": e.q5,
      "Q6: आप क्या काम करते हैं?": e.q6,
      "Q7: अपने जीवन से कितना खुश हैं?": e.q7,
      "Q8: परिवार की मुख्य समस्या": e.q8,
      "Q9: प्रश्न 9": e.q9,
      "Q10: प्रश्न 10": e.q10,
      "Q11: प्रश्न 11": e.q11,
      "Q12: प्रश्न 12": e.q12,
      "Q13: प्रश्न 13": e.q13,
      "Q14: प्रश्न 14": e.q14,
      "Q15: प्रश्न 15": e.q15,
      "Q16: प्रश्न 16": e.q16,
      "Q17: प्रश्न 17": e.q17,
      "Q18: प्रश्न 18": e.q18,
      "Q19: प्रश्न 19": e.q19,
      "Q20: प्रश्न 20": e.q20,
      "Q21: प्रश्न 21": e.q21,
      "Q22: प्रश्न 22": e.q22,
      "Q23: प्रश्न 23": e.q23,
      "Q24: प्रश्न 24": e.q24,
      "Q25: प्रश्न 25": e.q25,
      "Q26: प्रश्न 26": e.q26,
      "Q27: प्रश्न 27": e.q27,
      "Q28: प्रश्न 28": e.q28,
      "Q29: प्रश्न 29": e.q29,
      "Q30: प्रश्न 30": e.q30,
      "Q31: प्रश्न 31": e.q31,
      "Q32: प्रश्न 32": e.q32,
      "Mobile Number": e.mobileNumber,
      "Created By": e.createdBy,
      "Survey Date": new Date(e.appointmentDate).toLocaleDateString("en-IN"),
      "Create Date": e.createDate
        ? isNaN(new Date(e.createDate))
          ? e.createDate
          : new Date(e.createDate).toLocaleString("en-IN", options)
        : "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Entries");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=survey_software.xlsx"
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

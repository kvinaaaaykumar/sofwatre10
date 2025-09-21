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

    // Format data for Excel
    const formattedData = entries.map((e, index) => ({
      "S.No": index + 1,
      Name: e.name,
      Gender: e.age,
      Address: e.address,
      Purpose: e.purpose,
      "Q1: उम्र": e.q1,
      "Q2: स्थान": e.q2,
      "Q3: शिक्षा": e.q3,
      "Q4: परिवार की आर्थिक हालत": e.q4,
      "Q5: राजनीति में रुचि": e.q5,
      "Q6: आप क्या काम करते हैं?": e.q6,
      "Q7: अपने जीवन से कितना खुश हैं?": e.q7,
      "Q8: परिवार की मुख्य समस्या": e.q8,

      "Q9A: मनरेगा": e.q9a,
      "Q9B: PM किसान": e.q9b,
      "Q9C: 108 Ambulance": e.q9c,
      "Q9D: 100 पुलिस सहायता": e.q9d,
      "Q9E: किसान कर्जा माफी": e.q9e,
      "Q9F: छात्रों को Laptop": e.q9f,
      "Q9G: उज्जवला योजना": e.q9g,
      "Q9H: स्वच्छ भारत शौचालय": e.q9h,

      "Q10: विधायक के काम काज से संतुष्टि": e.q10,
      "Q11: टिकट मिलने पर दोबारा चुनना चाहेंगे?": e.q11,
      "Q12: वर्तमान सरकार से संतुष्टि": e.q12,
      "Q13: सरकार को दोबारा चुनना चाहेंगे?": e.q13,
      "Q14: अगला मुख्यमंत्री?": e.q14,
      "Q15: भाजपा पसंद": e.q15,
      "Q16: सपा पसंद": e.q16,
      "Q17: बसपा पसंद": e.q17,
      "Q18: कांग्रेस पसंद": e.q18,
      "Q19: प्रगतिशील समाजवादी पार्टी": e.q19,
      "Q20: भाजपा संभावित उम्मीदवार": e.q20,
      "Q21: सपा संभावित उम्मीदवार": e.q21,
      "Q22: बसपा संभावित उम्मीदवार": e.q22,
      "Q23: कांग्रेस संभावित उम्मीदवार": e.q23,
      "Q24: अन्य दल उम्मीदवार": e.q24,
      "Q25: अगला विधायक कौन": e.q25,
      "Q26: वोट का आधार": e.q26,
      "Q27: सामाजिक वर्ग": e.q27,
      "Q28: धर्म": e.q28,
      "Q29: 2017 चुनाव वोट": e.q29,
      "Q30: 2019 चुनाव वोट": e.q30,
      "Q31: अगर आज चुनाव हो तो वोट": e.q31,
      "Q32: किसकी सरकार बनेगी": e.q32,
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

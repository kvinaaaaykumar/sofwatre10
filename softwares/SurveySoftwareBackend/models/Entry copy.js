const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: String, required: true },
  address: { type: String, required: true },
  purpose: { type: String, required: true },
  appointmentDate: { type: String, required: true },
  createDate: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  createdBy: { type: String, required: true }
});

module.exports = mongoose.model("Entry", entrySchema);

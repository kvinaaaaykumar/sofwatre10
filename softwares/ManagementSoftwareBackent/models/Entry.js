const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
  name: { type: String },
  age: { type: String },
  address: { type: String },
  purpose: { type: String },
  appointmentDate: { type: String },
  createDate: { type: String },
  mobileNumber: { type: String },
  createdBy: { type: String }
});

module.exports = mongoose.model("Entry", entrySchema);

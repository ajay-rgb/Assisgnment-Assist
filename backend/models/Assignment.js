const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  text: { type: String, required: true },
    id: { type: String, required: true, unique: true }, 
  createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true }
});

module.exports = mongoose.model('Assignment', assignmentSchema);
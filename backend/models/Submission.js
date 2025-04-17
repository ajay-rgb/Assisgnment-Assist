const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  assignmentId: { type: String, required: true },
  status: { type: String, required: true },
  submissionDate: { type: Date, required: true },
  grade: { type: Number },
  plagiarismPercentage: { type: Number },
  id: { type: String, required: true, unique: true },
  text: {type: String, required: true}
});

module.exports = mongoose.model('Submission', submissionSchema);
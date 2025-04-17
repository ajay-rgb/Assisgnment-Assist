const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    hint: { type: String, required: true },
    type: { type: String, required: true },
    topic: { type: String, required: true },
    difficulty: { type: String, required: true }
});

module.exports = mongoose.model('Question', questionSchema);
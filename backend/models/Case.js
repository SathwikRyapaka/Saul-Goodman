const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  id: { type: String, required: true },
  caseNumber: { type: String, required: true },
  type: { type: String, required: true },
  court: { type: String, required: true },
  category: { type: String, required: true },
  petitioner: { type: String, required: true },
  respondent: { type: String, required: true },
  filedDate: { type: String, required: true },
  status: { type: String, required: true },
  currentStage: { type: String, required: true },
  nextHearing: { type: String, required: true },
  priority: { type: String, default: 'normal' },
  aiSummary: { type: String },
  lawyerNotes: { type: String },
  documents: [{
    id: String,
    name: String,
    type: String,
    date: String,
    status: String,
    uploadedBy: String
  }],
  events: [String]
}, { timestamps: true });

module.exports = mongoose.model('Case', caseSchema);

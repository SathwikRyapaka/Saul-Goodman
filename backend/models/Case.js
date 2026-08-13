const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  case_id: { type: Number, required: true, unique: true },
  state: { type: String },
  district: { type: String },
  court_complex: { type: String },
  establishment: { type: String },
  court_number: { type: String },
  court_name: { type: String },
  case_type: { type: String },
  case_number: { type: String, required: true, unique: true },
  case_year: { type: Number },
  filing_number: { type: String },
  filing_date: { type: String },
  registration_number: { type: String },
  registration_date: { type: String },
  cnr_number: { type: String, required: true, unique: true },
  case_status: { type: String },
  first_hearing_date: { type: String },
  decision_date: { type: String, default: null },
  nature_of_disposal: { type: String, default: null },
  last_order: { type: String },
  case_transferred_to_establishment: { type: String, default: null },
  transfer_date: { type: String, default: null },
  under_acts: [{
    act: { type: String },
    sections: [{ type: String }]
  }],
  petitioners: [{
    name: { type: String },
    advocate: { type: String }
  }],
  respondents: [{
    name: { type: String }
  }],
  case_history: [{
    business_date: { type: String },
    next_hearing_date: { type: String }
  }]
}, {
  timestamps: true
});

caseSchema.index({ case_number: 1 });
caseSchema.index({ cnr_number: 1 });
caseSchema.index({ registration_number: 1 });

module.exports = mongoose.model('Case', caseSchema);

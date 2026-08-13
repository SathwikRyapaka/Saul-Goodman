const mongoose = require('mongoose');

const eligibilitySchema = new mongoose.Schema({
  category: { type: String, required: true },
  description: { type: String, required: true },
  source: { type: String }
}, { _id: false });

const processStepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true }
}, { _id: false });

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
}, { _id: false });

const sourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true }
}, { _id: false });

const legalServiceSchema = new mongoose.Schema({
  service_type: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  }, // e.g., 'legal-aid', 'mediation', 'lok-adalat'
  title: { type: String, required: true },
  description: { type: String, required: true },
  eligibility_information: [eligibilitySchema],
  process_steps: [processStepSchema],
  documents_information: [String],
  faqs: [faqSchema],
  official_sources: [sourceSchema],
  last_updated: { type: Date, default: Date.now }
});

// Adding text index for searching
legalServiceSchema.index({ 
  title: 'text', 
  description: 'text', 
  'faqs.question': 'text' 
});

module.exports = mongoose.model('LegalService', legalServiceSchema);

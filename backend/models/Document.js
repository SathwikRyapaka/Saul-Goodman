const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  rawText: { type: String },
  structuredCaseData: {
    courtDetails: {
      courtName: { type: String, default: null },
      district: { type: String, default: null },
      state: { type: String, default: null }
    },
    caseDetails: {
      caseType: { type: String, default: null },
      caseNumber: { type: String, default: null },
      caseYear: { type: String, default: null },
      filingNumber: { type: String, default: null },
      filingDate: { type: String, default: null },
      registrationNumber: { type: String, default: null },
      registrationDate: { type: String, default: null },
      cnrNumber: { type: String, default: null },
      caseStatus: { type: String, default: null },
      firstHearingDate: { type: String, default: null },
      decisionDate: { type: String, default: null },
      natureOfDisposal: { type: String, default: null },
      lastOrder: { type: String, default: null },
      courtNumber: { type: String, default: null },
      judge: { type: String, default: null }
    },
    parties: {
      petitioner: [{
        name: { type: String },
        role: { type: String }
      }],
      respondent: [{
        name: { type: String },
        role: { type: String }
      }]
    },
    actsAndSections: [{
      act: { type: String },
      sections: [{ type: String }]
    }],
    caseHistory: [{
      businessDate: { type: String },
      nextHearingDate: { type: String }
    }]
  },
  aiSummary: {
    caseSummary: { type: String },
    caseStatus: { type: String },
    currentStage: { type: String },
    importantDates: [{
      label: { type: String },
      date: { type: String }
    }],
    importantProceedings: [{ type: String }],
    disposalDetails: { type: String },
    actsAndSections: [{ type: mongoose.Schema.Types.Mixed }],
    simpleEnglishExplanation: { type: String },
    teluguExplanation: { type: String },
    importantPoints: [{ type: String }]
  },
  processingStatus: { 
    type: String, 
    enum: ['uploaded', 'extracting', 'ocr_processing', 'analyzing', 'completed', 'failed'],
    default: 'uploaded'
  }
});

module.exports = mongoose.model('Document', documentSchema);

const Case = require('../models/Case');
const mongoose = require('mongoose');

// Search cases by keyword (case number, cnr, names)
exports.searchCases = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
      return res.json({ success: true, count: 0, cases: [], message: "No search query provided" });
    }

    const searchQuery = q.trim();

    // Try exact match for case_number or cnr_number or registration_number first
    let matchingCases = await Case.find({
      $or: [
        { case_number: { $regex: new RegExp('^' + searchQuery + '$', 'i') } },
        { cnr_number: { $regex: new RegExp('^' + searchQuery + '$', 'i') } },
        { registration_number: { $regex: new RegExp('^' + searchQuery + '$', 'i') } }
      ]
    });

    // If no exact match, do a broader search including party names
    if (matchingCases.length === 0) {
      matchingCases = await Case.find({
        $or: [
          { case_number: { $regex: searchQuery, $options: 'i' } },
          { cnr_number: { $regex: searchQuery, $options: 'i' } },
          { registration_number: { $regex: searchQuery, $options: 'i' } },
          { 'petitioners.name': { $regex: searchQuery, $options: 'i' } },
          { 'respondents.name': { $regex: searchQuery, $options: 'i' } }
        ]
      });
    }

    if (matchingCases.length === 0) {
      return res.json({ success: true, count: 0, cases: [], message: "No case found" });
    }

    res.json({
      success: true,
      count: matchingCases.length,
      cases: matchingCases
    });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ success: false, message: "An error occurred during search" });
  }
};

// Get single case by Mongo ID
exports.getCaseById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid case ID format' });
    }
    const caseItem = await Case.findById(req.params.id);
    if (!caseItem) return res.status(404).json({ success: false, message: 'Case not found' });
    res.json({ success: true, case: caseItem });
  } catch (err) {
    console.error("Get case by ID error:", err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get case by CNR
exports.getCaseByCnr = async (req, res) => {
  try {
    const caseItem = await Case.findOne({ cnr_number: { $regex: new RegExp('^' + req.params.cnr + '$', 'i') } });
    if (!caseItem) return res.status(404).json({ success: false, message: 'Case not found' });
    res.json({ success: true, case: caseItem });
  } catch (err) {
    console.error("Get case by CNR error:", err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get case by Case Number
exports.getCaseByNumber = async (req, res) => {
  try {
    const caseItem = await Case.findOne({ case_number: { $regex: new RegExp('^' + req.params.caseNumber + '$', 'i') } });
    if (!caseItem) return res.status(404).json({ success: false, message: 'Case not found' });
    res.json({ success: true, case: caseItem });
  } catch (err) {
    console.error("Get case by Number error:", err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

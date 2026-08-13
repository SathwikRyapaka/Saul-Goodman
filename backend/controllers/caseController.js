const Case = require('../models/Case');
const mongoose = require('mongoose');
const { authorizeCaseAccess, escapeRegExp, normalizeName } = require('../utils/authUtils');

// Search cases by keyword (case number, cnr, names)
exports.searchCases = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
      return res.json({ success: true, count: 0, cases: [], message: "No search query provided" });
    }

    const searchQuery = q.trim();
    const userFullName = req.user.name;

    // We add an authCondition to the DB query to limit fetched records, 
    // but we will STILL verify strictly in JS.
    const authRegex = new RegExp('^' + escapeRegExp(userFullName.trim()) + '$', 'i');
    const authCondition = {
      $or: [
        { 'petitioners.name': authRegex },
        { 'respondents.name': authRegex }
      ]
    };

    // Try exact match for case_number or cnr_number or registration_number first
    let matchingCases = await Case.find({
      $and: [
        {
          $or: [
            { case_number: { $regex: new RegExp('^' + escapeRegExp(searchQuery) + '$', 'i') } },
            { cnr_number: { $regex: new RegExp('^' + escapeRegExp(searchQuery) + '$', 'i') } },
            { registration_number: { $regex: new RegExp('^' + escapeRegExp(searchQuery) + '$', 'i') } }
          ]
        },
        authCondition
      ]
    });

    // If no exact match, do a broader search including party names
    if (matchingCases.length === 0) {
      matchingCases = await Case.find({
        $and: [
          {
            $or: [
              { case_number: { $regex: escapeRegExp(searchQuery), $options: 'i' } },
              { cnr_number: { $regex: escapeRegExp(searchQuery), $options: 'i' } },
              { registration_number: { $regex: escapeRegExp(searchQuery), $options: 'i' } },
              { 'petitioners.name': { $regex: escapeRegExp(searchQuery), $options: 'i' } },
              { 'respondents.name': { $regex: escapeRegExp(searchQuery), $options: 'i' } }
            ]
          },
          authCondition
        ]
      });
    }

    // Strict JS post-filtering to guarantee no partial match leakage
    const authorizedCases = matchingCases.filter(c => authorizeCaseAccess(c, userFullName));

    if (authorizedCases.length === 0) {
      return res.json({ success: true, count: 0, cases: [], message: "No cases found for your account." });
    }

    res.json({
      success: true,
      count: authorizedCases.length,
      cases: authorizedCases
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
    
    if (!authorizeCaseAccess(caseItem, req.user.name)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    res.json({ success: true, case: caseItem });
  } catch (err) {
    console.error("Get case by ID error:", err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get case by CNR
exports.getCaseByCnr = async (req, res) => {
  try {
    const caseItem = await Case.findOne({ cnr_number: { $regex: new RegExp('^' + escapeRegExp(req.params.cnr) + '$', 'i') } });
    if (!caseItem) return res.status(404).json({ success: false, message: 'Case not found' });

    if (!authorizeCaseAccess(caseItem, req.user.name)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    res.json({ success: true, case: caseItem });
  } catch (err) {
    console.error("Get case by CNR error:", err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get case by Case Number
exports.getCaseByNumber = async (req, res) => {
  try {
    const caseItem = await Case.findOne({ case_number: { $regex: new RegExp('^' + escapeRegExp(req.params.caseNumber) + '$', 'i') } });
    if (!caseItem) return res.status(404).json({ success: false, message: 'Case not found' });

    if (!authorizeCaseAccess(caseItem, req.user.name)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    res.json({ success: true, case: caseItem });
  } catch (err) {
    console.error("Get case by Number error:", err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

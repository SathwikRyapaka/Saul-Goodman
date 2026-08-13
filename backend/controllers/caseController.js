const Case = require('../models/Case');

// Get all cases
exports.getCases = async (req, res) => {
  try {
    const cases = await Case.find().sort({ createdAt: -1 });
    res.json(cases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single case
exports.getCaseById = async (req, res) => {
  try {
    const caseItem = await Case.findOne({ id: req.params.id });
    if (!caseItem) return res.status(404).json({ message: 'Case not found' });
    res.json(caseItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a case
exports.createCase = async (req, res) => {
  const caseItem = new Case(req.body);
  try {
    const newCase = await caseItem.save();
    res.status(201).json(newCase);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

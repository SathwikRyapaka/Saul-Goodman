const MyCase = require('../models/MyCase');
const Case = require('../models/Case');
const { authorizeCaseAccess } = require('../utils/authUtils');

// @desc    Add case to My Cases
// @route   POST /api/my-cases
// @access  Private
const addCase = async (req, res) => {
  try {
    const { case_id } = req.body;
    
    // Ensure case_id is provided
    if (!case_id) {
      return res.status(400).json({ success: false, message: 'Case ID is required' });
    }

    // Check if the case exists in main cases collection
    const existingCase = await Case.findById(case_id);
    if (!existingCase) {
      return res.status(404).json({ success: false, message: 'Case not found in database' });
    }

    // AUTHORIZATION: Ensure the user is actually a party to this case
    if (!authorizeCaseAccess(existingCase, req.user.name)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    // Check if it's already saved by this user
    const alreadySaved = await MyCase.findOne({
      user_id: req.user._id,
      case_id: case_id
    });

    if (alreadySaved) {
      return res.status(409).json({ success: false, message: 'Case is already in My Cases' });
    }

    // Save the case
    const myCase = await MyCase.create({
      user_id: req.user._id,
      case_id: case_id
    });

    res.status(201).json({
      success: true,
      message: 'Case added to My Cases',
      myCase
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Case is already in My Cases' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's saved cases
// @route   GET /api/my-cases
// @access  Private
const getMyCases = async (req, res) => {
  try {
    // Only fetch cases for the logged-in user
    const myCases = await MyCase.find({ user_id: req.user._id })
      .populate('case_id')
      .sort({ saved_at: -1 });
    
    // Extract the populated cases
    const cases = myCases.map(mc => ({
      ...mc.case_id.toObject(),
      saved_at: mc.saved_at
    }));

    res.status(200).json({
      success: true,
      count: cases.length,
      cases
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove case from My Cases
// @route   DELETE /api/my-cases/:caseId
// @access  Private
const removeCase = async (req, res) => {
  try {
    const { caseId } = req.params;

    // Make sure we only delete if it belongs to the authenticated user
    const deleted = await MyCase.findOneAndDelete({
      user_id: req.user._id,
      case_id: caseId
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Saved case not found for this user' });
    }

    res.status(200).json({
      success: true,
      message: 'Case removed from My Cases'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Check multiple cases status
// @route   POST /api/my-cases/check
// @access  Private
const checkCases = async (req, res) => {
  try {
    const { caseIds } = req.body;
    
    if (!caseIds || !Array.isArray(caseIds)) {
      return res.status(400).json({ success: false, message: 'Array of caseIds is required' });
    }

    const savedCases = await MyCase.find({
      user_id: req.user._id,
      case_id: { $in: caseIds }
    });

    const savedIds = savedCases.map(mc => mc.case_id.toString());
    
    // Create a map of boolean statuses
    const statuses = {};
    caseIds.forEach(id => {
      statuses[id] = savedIds.includes(id);
    });

    res.status(200).json({
      success: true,
      statuses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addCase,
  getMyCases,
  removeCase,
  checkCases
};

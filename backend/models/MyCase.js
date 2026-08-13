const mongoose = require('mongoose');

const MyCaseSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    case_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case',
      required: true
    },
    saved_at: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Prevent a user from saving the same case multiple times
MyCaseSchema.index({ user_id: 1, case_id: 1 }, { unique: true });

module.exports = mongoose.model('MyCase', MyCaseSchema);

const mongoose = require('mongoose');

const legalAuthoritySchema = new mongoose.Schema({
  state: { type: String, required: true, index: true },
  district: { type: String, required: true, index: true },
  authority_name: { type: String, required: true },
  address: { type: String },
  phone: { type: String },
  email: { type: String },
  website: { type: String },
  map_url: { type: String },
  source: { type: String },
  last_updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LegalAuthority', legalAuthoritySchema);

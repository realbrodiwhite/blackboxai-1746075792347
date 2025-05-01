const mongoose = require('mongoose');

const CitationSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String },
  website: { type: String },
  email: { type: String },
  description: { type: String },
  categories: [String],
  syncData: {
    type: Map,
    of: new mongoose.Schema({
      citationId: String,
      status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
      lastSynced: Date,
      errorMessage: String,
    }, { _id: false }),
    default: {},
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Citation', CitationSchema);

const express = require('express');
const router = express.Router();
const authMiddleware = require('../utils/authMiddleware');
const Citation = require('../models/Citation');

// Get sync status report for all citations of the logged-in user
router.get('/sync-status', authMiddleware, async (req, res) => {
  try {
    const citations = await Citation.find({ createdBy: req.user.id });
    const report = citations.map(citation => ({
      id: citation._id,
      businessName: citation.businessName,
      syncData: citation.syncData,
      lastUpdated: citation.updatedAt,
    }));
    res.json({ report });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const authMiddleware = require('../utils/authMiddleware');
const syncController = require('../controllers/syncController');

router.post('/', authMiddleware, async (req, res) => {
  const { citationIds } = req.body;
  if (!Array.isArray(citationIds) || citationIds.length === 0) {
    return res.status(400).json({ message: 'citationIds must be a non-empty array' });
  }

  try {
    const results = [];
    for (const id of citationIds) {
      try {
        const result = await syncController.syncCitationById(id, req.user.id);
        results.push({ id, success: true, data: result });
      } catch (err) {
        results.push({ id, success: false, error: err.message });
      }
    }
    res.json({ results });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

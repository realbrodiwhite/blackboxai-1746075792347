const express = require('express');
const router = express.Router();
const Citation = require('../models/Citation');
const authMiddleware = require('../utils/authMiddleware');

// Get all citations for logged-in user with pagination and search
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = {
      createdBy: req.user.id,
      $or: [
        { businessName: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ],
    };
    const citations = await Citation.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Citation.countDocuments(query);
    res.json({
      citations,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new citation
router.post('/', authMiddleware, async (req, res) => {
  try {
    const citation = new Citation({ ...req.body, createdBy: req.user.id });
    await citation.save();
    res.status(201).json(citation);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

// Update a citation
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const citation = await Citation.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true }
    );
    if (!citation) {
      return res.status(404).json({ message: 'Citation not found' });
    }
    res.json(citation);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

// Delete a citation
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const citation = await Citation.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!citation) {
      return res.status(404).json({ message: 'Citation not found' });
    }
    res.json({ message: 'Citation deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

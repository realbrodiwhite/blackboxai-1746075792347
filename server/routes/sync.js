const express = require('express');
const router = express.Router();
const authMiddleware = require('../utils/authMiddleware');
const syncController = require('../controllers/syncController');

router.post('/citation/:id', authMiddleware, syncController.syncCitation);

module.exports = router;

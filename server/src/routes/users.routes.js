const express = require('express');
const router = express.Router();
const controller = require('../controllers/users.controller');
const { requireAuth } = require('../middleware/requireAuth');

// Get or create current user
router.get('/me', requireAuth, controller.getCurrentUser);

module.exports = router;


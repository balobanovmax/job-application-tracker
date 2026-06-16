const express = require('express');
const router = express.Router();
const controller = require('../controllers/applications.controller');
const { requireAuth } = require('../middleware/requireAuth');

router.get('/', requireAuth, controller.getAllApplications);
router.get('/:id/history', requireAuth, controller.getApplicationStatusHistory);
router.get('/:id', requireAuth, controller.getApplicationById);
router.post('/', requireAuth, controller.createApplication);
router.patch('/:id', requireAuth, controller.updateApplication);
router.patch('/:id/history/:historyId', requireAuth, controller.updateApplicationStatusHistoryEntry);
router.delete('/:id/history', requireAuth, controller.clearApplicationStatusHistory);
router.delete('/:id', requireAuth, controller.deleteApplication);
router.delete('/', requireAuth, controller.deleteAllApplications);

module.exports = router;


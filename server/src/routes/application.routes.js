const express = require('express');
const router = express.Router();
const controller = require('../controllers/applications.controller');

router.get('/', controller.getAllApplications);
router.get('/:id', controller.getApplicationById);
router.post('/', controller.createApplication);
router.patch('/:id', controller.updateApplication);
router.delete('/:id', controller.deleteApplication);
router.delete('/', controller.deleteAllApplications);

module.exports = router;


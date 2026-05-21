const express = require('express');
const router = express.Router();
const expiryController = require('./expiry.controller');

router.get('/analytics', expiryController.getDashboardAnalytics);
router.get('/week', expiryController.getExpiringThisWeek);
router.get('/month', expiryController.getExpiringThisMonth);
router.get('/year', expiryController.getExpiringThisYear);
router.get('/expired', expiryController.getExpired);
router.get('/healthy', expiryController.getHealthyStock);
router.get('/all', expiryController.getAllWithStatus);

module.exports = router;
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/admin');

router.use(protect);
router.use(isAdmin);

router.get('/dashboard', analyticsController.getDashboardMetrics);
router.get('/requests-by-industry', analyticsController.getRequestsByIndustry);
router.get('/top-materials', analyticsController.getTopMaterials);
router.get('/stock-report', analyticsController.getStockReport);
router.get('/buyer-insights', analyticsController.getBuyerInsights);
router.get('/timeline', analyticsController.getRequestTimeline);

module.exports = router;

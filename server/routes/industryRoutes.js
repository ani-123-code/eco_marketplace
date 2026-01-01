const express = require('express');
const router = express.Router();
const industryController = require('../controllers/industryController');
const { protect } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/admin');

router.get('/', industryController.getAllIndustries);
router.get('/:slug', industryController.getIndustryBySlug);

router.post('/', protect, isAdmin, industryController.createIndustry);
router.put('/:id', protect, isAdmin, industryController.updateIndustry);
router.delete('/:id', protect, isAdmin, industryController.deleteIndustry);
router.patch('/:id/toggle', protect, isAdmin, industryController.toggleIndustryStatus);

module.exports = router;

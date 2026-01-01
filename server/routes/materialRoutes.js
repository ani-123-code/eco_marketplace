const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const { protect } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/admin');

router.get('/', materialController.getMaterials);
router.get('/filters/:industrySlug', materialController.getFiltersForIndustry);
router.get('/:id', materialController.getMaterialById);

router.post('/', protect, isAdmin, materialController.createMaterial);
router.put('/:id', protect, isAdmin, materialController.updateMaterial);
router.delete('/:id', protect, isAdmin, materialController.deleteMaterial);
router.patch('/:id/stock', protect, isAdmin, materialController.adjustStock);
router.post('/:id/attributes', protect, isAdmin, materialController.updateAttributes);

module.exports = router;

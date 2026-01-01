const express = require('express');
const router = express.Router();
const {
  createContactMessage,
  getContactMessages,
  updateContactMessage
} = require('../controllers/contactController');
const { protect } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/admin');

router.post('/', createContactMessage);

router.use(protect);
router.use(isAdmin);

router.get('/', getContactMessages);
router.patch('/:id', updateContactMessage);

module.exports = router;


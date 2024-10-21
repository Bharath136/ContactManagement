const express = require('express');
const { addContact, getContacts, updateContact, deleteContact } = require('../controllers/contactController');
const { authenticate } = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authenticate); // Protect routes

router.post('/', addContact);
router.get('/', getContacts);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

module.exports = router;

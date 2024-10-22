const express = require('express');
const { bulkUploadExcel, addContact, getContacts, updateContact, deleteContact } = require('../controllers/contactController');
const { authenticate } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware'); // Multer config
const router = express.Router();

router.use(authenticate); // Protect routes

router.post('/', addContact);

// Route for uploading Excel file
router.post('/upload/excel', upload.single('file'), bulkUploadExcel);

router.get('/', getContacts);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

module.exports = router;

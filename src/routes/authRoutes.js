const express = require('express');
const { register, login, verifyEmail, getUsers } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/', getUsers)
router.get('/verify/:token', verifyEmail);

module.exports = router;

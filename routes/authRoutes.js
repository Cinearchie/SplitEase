const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const {ensureAuthenticated} = require('../middleware/authMiddleware')


router.get('/register', (req, res) => res.render('auth/register'));
router.post('/register', authController.register);
router.get('/login', (req, res) => res.render('auth/login'));
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    console.log('Dashboard route accessed, user:', req.user); // Debug log
    res.render('dashboard', { user: req.user });
  });
  

module.exports = router;
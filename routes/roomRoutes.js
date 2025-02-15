const express = require('express');
const roomController = require('../controllers/roomController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const router = express.Router();


router.get('/' , (req,res) => {
    res.render('home')
})
router.get('/create-room', (req, res) => {
    res.render('room/createRoom'); // Render the create room form
  });
  
router.post('/create-room',ensureAuthenticated,roomController.createRoom);
router.post('/join-room',ensureAuthenticated,roomController.joinRoom);
router.get('/room/:roomId', roomController.getRoomDashboard);


router.get('/join-room', (req, res) => {
    res.render('room/joinRoom'); // Render the join room form
  });
  
router.post('/join-room', roomController.joinRoom); // Handle join room form submission

module.exports = router;
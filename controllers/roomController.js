const Room = require('../models/Room');
const User = require('../models/User');
const bcrypt = require('bcryptjs');


exports.createRoom = async (req, res) => {
  const { name, roomId, password } = req.body;
  try {
    const existingRoom = await Room.findOne({ roomId });
    if (existingRoom) {
      console.log('already exists')
      req.flash('error_msg', 'Room ID already exists. Please choose a different one.');
      return res.redirect('/create-room');
    }
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the room password
    const room = new Room({ name, roomId, password: hashedPassword, createdBy: req.user._id, members: [req.user._id] });
    await room.save();
    req.flash('success_msg', 'Room created successfully!');
    res.redirect(`/room/${room.roomId}`);
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Failed to create room. Please try again.');
    res.redirect('/create-room');
  }
};

exports.joinRoom = async (req, res) => {
  const { roomId, password } = req.body;
  try {
    const room = await Room.findOne({ roomId });
    if (!room) {
      req.flash('error_msg', 'Room not found.');
      return res.redirect('/join-room');
    }
    const isMatch = await bcrypt.compare(password, room.password); // Verify hashed password
    if (!isMatch) {
      req.flash('error_msg', 'Incorrect room password.');
      return res.redirect('/join-room');
    }
    if (!room.members.includes(req.user._id)) {
      room.members.push(req.user._id);
      await room.save();
    }
    req.flash('success_msg', 'You have joined the room successfully!');
    res.redirect(`/room/${room.roomId}`);
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Failed to join room. Please try again.');
    res.redirect('/join-room');
  }
};

exports.getRoomDashboard = async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId }).populate('members');
    res.render('room/roomDashboard', { room });
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
};
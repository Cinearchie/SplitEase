const passport = require('passport'); // Import passport
const User = require('../models/User');

exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const user = new User({ name, email, password });
    await user.save();
    console.log(user);
    req.flash('success_msg', 'Registration successful! You are now logged in.');
    
    req.login(user, (err) => {
      if (err) return next(err);
      if (req.headers['content-type'] === 'application/json') {
        return res.json({ success: true, redirect: '/dashboard' });
      }
      return res.redirect('/dashboard');
    });

  } catch (err) {
    console.log(err);
    req.flash('error_msg', 'Registration failed. Please try again.');
    if (req.headers['content-type'] === 'application/json') {
      return res.status(400).json({ success: false, error: 'Registration failed' });
    }
    res.redirect('/register');
  }
};



exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      console.log('user not found')
      req.flash('error_msg', 'Incorrect email or password.'); // Flash message
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      req.flash('success_msg', 'You are now logged in.'); // Flash message
      return res.redirect('/dashboard');
    });
  })(req, res, next);
};

exports.logout = (req, res, next) => {
  req.logout(); // No callback needed in Express 5
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie('connect.sid'); 
    console.log('Session getting cancelled!!');
    res.redirect('/');
  });
};
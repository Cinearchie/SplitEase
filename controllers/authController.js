const passport = require('passport'); // Import passport
const User = require('../models/User');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = new User({ name, email, password });
    await user.save();
    req.flash('success_msg', 'Registration successful! You are now logged in.'); // Flash message
    req.login(user, (err) => { // Auto-login after registration
      if (err) return next(err);
      return res.redirect('/dashboard');
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Registration failed. Please try again.'); // Flash message
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

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((err) => { // Destroy the session
      if (err) return next(err);
      res.clearCookie('connect.sid'); // Clear the session cookie
      console.log('Session getting cancelled!!')
      res.redirect('/');
    });
  });
};
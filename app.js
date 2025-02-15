const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport'); // Import passport
const dotenv = require('dotenv');
const flash = require('connect-flash'); // Import connect-flash
const http = require('http');
const socketio = require('socket.io');
const MongoStore = require('connect-mongo');

const routes = require('./routes');
const expenseRoutes = require('./routes/expenseRoutes'); // Import expense routes
const roomRoutes = require('./routes/roomRoutes')
dotenv.config();

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = socketio(server); // Attach Socket.IO to the server

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Session configuration (required for flash messages)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI, // Your MongoDB connection string
    ttl: 14 * 24 * 60 * 60, // Session lifetime: 14 days
  }),
}));

// Initialize flash messages
app.use(flash());

// Make flash messages available in all views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});
app.use(passport.initialize()); // Initialize passport
app.use(passport.session()); // Enable session support for passport
require('./config/passport')(passport)
// Set up EJS
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Routes
app.use('/', routes);
app.use('/', expenseRoutes); // Use expense routes
app.use('/',roomRoutes)

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('New client connected');

  // Join a room based on roomId
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Attach io to app for use in controllers
app.set('io', io);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

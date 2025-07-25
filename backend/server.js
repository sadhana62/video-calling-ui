const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const User = require('./models/User');
const path = require('path');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Serve static files from the React app only in development (local)
if (process.env.NODE_ENV !== 'production') {
  const buildPath = path.resolve(__dirname, '../build');
  app.use(express.static(buildPath));
  app.get('/*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  // In production, just serve API and health check
  app.get('/', (req, res) => {
    res.send('API is running');
  });
}

// Signup route
app.post('/api/signup', async (req, res) => {
  console.log(req.body);
  try {
    const { username, email, password, confirmPassword } = req.body;
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }
    res.status(200).json({ message: 'Login successful.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // For development only! Restrict in production.
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  // User joins a room
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);

    // Notify others in the room
    socket.to(roomId).emit('user-joined', userId);

    // Relay signaling data (offer/answer/ice)
    socket.on('signal', (data) => {
      // data: { to, from, type, offer/answer/candidate }
      io.to(roomId).emit('signal', data);
    });

    // Relay chat messages
    socket.on('chat-message', (msg) => {
      io.to(roomId).emit('chat-message', { userId, msg });
    });

    // Notify on disconnect
    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-left', userId);
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 
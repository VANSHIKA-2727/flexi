const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const User = require('./models/user');

// Import routes
const expenseRoutes = require('./routes/expenseRoutes');
const connectDB = require('./config/db');

// Create an express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Use routes
app.use('/api/expenses', expenseRoutes);

// Define the root route to avoid "Cannot GET /" error
app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

// User Registration
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const newUser = new User({
            username,
            password: password,
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user: ' + error.message });
    }
});

// User Login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || !((password===user.password))) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        res.status(200).json({ message: 'Login successful', username });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in: ' + error.message });
    }
});

// Update Username
app.post('/edit-username', async (req, res) => {
    try {
      const { userId , newUsername } = req.body;
  
      // Find the user in the database
      const user = await User.findOne({ userId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      // Update the user's password
      user.username = newUsername;
      await user.save();
  
      res.status(200).json({ message: 'Username updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating username: ' + error.message });
    }
  });

// Update Password
app.post('/edit-password', async (req, res) => {
    try {
        const { newUsername, currentPassword, newPassword, confirmPassword } = req.body;
        // Check if new password matches the confirm password
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'New passwords do not match' });
        }
        // Find user by ID
        let username = newUsername;
        const user = await User.findOne({username});
        console.log(user);
        // Check if current password is correct
        const isCurrentPasswordCorrect = (currentPassword===user.password);
        if (!isCurrentPasswordCorrect) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        // Update password in the database
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating password: 400 ' + error.message });
    }
});

// Delete Account
app.post('/delete-account', async (req, res) => {
    try {
      const { newUsername, Password } = req.body;
        let username = newUsername;
        let password = Password;
      // Validate user input
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
  
      // Find user in the database
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Verify password (assuming user.password is hashed)
      const isMatch = password===user.password;
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      // Delete user
      await User.deleteOne({ username });
      res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting account: ' + error.message });
    }
  });


// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

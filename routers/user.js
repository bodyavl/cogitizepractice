const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../db/models/user');


router.post('/signup', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user document in MongoDB
        const user = User.create({ email, password: hashedPassword, movies: 0, tv: 0, suggestions: 0, man_suggestions: 0});
        // Log the user in and redirect to the dashboard
        // req.session.userId = user._id;
        res.status(200).send('OK');
    } catch (error) {
        next(error);
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Find the user by email in MongoDB
        const user = await User.findOne({ email });
        // Compare the hashed password with the user's input
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
        // Log the user in and redirect to the dashboard
        req.session.userId = user._id;
        res.status(200).send('OK');
        } else throw new Error("Invalid email or password");
    } catch (error) {
        next(error);
    }
  });

module.exports = router;
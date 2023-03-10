const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../db/models/user");
const Stats = require("../db/models/stats");

let refreshTokens = [];

router.post("/signup", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    const stats = await Stats.create({
        userId: user._id,
        movies: 0,
        tv: 0,
        suggestions: 0,
        man_suggestions: 0,
    })
    const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    refreshTokens.push(refreshToken);

    res.status(200).send({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Find the user by email in MongoDB
    const user = await User.findOne({ email });
    // Compare the hashed password with the user's input
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const accessToken = generateAccessToken(user);
      const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '2h' });
      refreshTokens.push(refreshToken);
      res.status(200).send({ accessToken, refreshToken });  
    } else throw new Error("Invalid email or password");
  } catch (error) {
    next(error);
  }
});
router.post('/token', (req, res, next) => {
  try {
    const refreshToken = req.body.token;
    if(!refreshToken) return res.sendStatus(401);
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) res.sendStatus(401);
      const accessToken = generateAccessToken(user);
      res.json({ accessToken })
    })
  } catch (error) {
    next(error);
  }
})
router.delete('/logout', (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if(!refreshToken) throw new Error("No token provided");
    refreshTokens = refreshTokens.filter(token => token !== refreshToken);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
})
router.get('/stats', authToken, async (req, res, next) => {
    
    try {
        const userId = req.user.userId;
        if(userId)
        {
            const stats = await Stats.findOne({ userId }).select("-_id -__v -userId");
            res.send(stats);
        }
        else throw new Error("You are not logged in");
    } catch (error) {
        next(error);
    }
})

function authToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader.split(' ')[1];
  if(!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if(err) return res.sendStatus(403);
    req.user = user;
    next();
  })
}

function generateAccessToken(user) {
  return jwt.sign({ userId: user._id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
}

module.exports = { userRouter: router, authToken };

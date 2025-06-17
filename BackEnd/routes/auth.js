const express = require('express');
const mongoose = require('mongoose');
const Users = require('../models/usersModel')
const jwt = require('jsonwebtoken');;
const router = express.Router();
const bcrypt = require("bcryptjs")

router.get('/usersAll', async (req, res) => {
  try {
    const users = await Users.find();
    res.status(200).json(users);
  } catch (err) {
    console.error('GET /users error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create a new annotation
// routes/anotationRoute.js

router.post('/addUsers', async (req, res) => {
  const {Annotator_ID, name, email, password, userType } = await req.body
    try {
      // Uniqueness on Annotator_ID + Src_Text
      const existing = await Users.findOne({
        email: req.body.email
      });
  
      if (existing) {
        return res.status(409).json({ message: 'Users already exists for this text and annotator' });
      }
      const hashed = await bcrypt.hash(password, 10);
      const users = await Users.create({ Annotator_ID, name, email, password: hashed, userType });
      res.status(201).json(users);
    } catch (err) {
      console.error('POST /users error:', err);
      res.status(500).json({ message: err.message });
    }
  });
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await Users.findOne({ email });
      if (!user) return res.status(400).json({ error: 'User not found' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
  
      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is missing from environment variables');
        return res.status(500).json({ error: 'Internal server error: JWT misconfiguration' });
      }
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
  
      res.status(200).json({ token });
    } catch (err) {
      console.error('Login error:', err);  
      res.status(500).json({ error: err.message });
    }
  });
// Update an users by ID
router.put('/UpdateUsers/:id', async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid annotation ID format' });
  }

  try {
    const annotation = await Users.findByIdAndUpdate(id, req.body, { new: true });
    if (!annotation) return res.status(404).json({ message: 'Users not found' });
    res.status(200).json(annotation);
  } catch (err) {
    console.error('PUT /users/:id error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Delete an annotation by ID
router.delete('/deleteUser/:id', async (req, res) => {
  try {
    const deleted = await Users.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Users not found' });
    res.status(200).json(deleted);
  } catch (err) {
    console.error('DELETE /users/:id error:', err);
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;

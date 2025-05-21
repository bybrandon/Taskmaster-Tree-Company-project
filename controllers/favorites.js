const express = require('express');
const router = express.Router();
const Yard = require('../models/yard');

// Middleware used to protect routes that need a logged in user
const ensureLoggedIn = require('../middleware/ensure-logged-in');

// GET /favorites
router.get('/favorites', ensureLoggedIn, async (req, res) => {
  const yards = await Yard.find({ favoritedBy: req.user._id }).sort('-createdAt');
  res.render('yards/index.ejs', { yards, title: 'My Favorite yards' });
});

// POST /yards/:id/favorites
router.post('/yards/:id/favorites', ensureLoggedIn, async (req, res) => {
  await Yard.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { favoritedBy: req.user._id } }
  );
  res.redirect(`/yards/${req.params.id}`);
});

// DELETE /yards/:id/favorites
router.delete('/yards/:id/favorites', ensureLoggedIn, async (req, res) => {
  await Yard.findByIdAndUpdate(
    req.params.id,
    { $pull: { favoritedBy: req.user._id } }
  );
  res.redirect(`/yards/${req.params.id}`);
});


module.exports = router;
const express = require('express');
const router = express.Router();

const ensureLoggedIn = require('../middleware/ensure-logged-in');
const Yard = require('../models/yard');
const User = require('../models/user');
const Tree = require('../models/tree');

// index action
router.get('/', ensureLoggedIn, async (req, res) => {
  const trees = await Tree.find({});
  const yards = await Yard.find({});
  res.render('yards/index.ejs', { yards, trees });
});
// GET /yards/new
router.get('/new', ensureLoggedIn, async (req, res) => {
  const trees = await Tree.find({});
  res.render('yards/new.ejs', { trees });
});

router.get('/favorites', ensureLoggedIn, async (req, res) => {
  const yards = await Yard.find({ favoritedBy: req.user._id }).sort('-createdAt');
  res.render('yards/favorites.ejs', { yards, title: 'Favorited Yards' });
});

// create
router.post('/', ensureLoggedIn, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id })
  const yard = await Yard.create(req.body)
  user.yards.push(yard._id)
  await user.save()
  res.redirect('/yards');
});

// show
router.get('/:id', ensureLoggedIn, async (req, res) => {
  const yard = await Yard.findById(req.params.id).populate('trees');
  console.log('This is the message', req.user);
  const isFavored = yard.favoritedBy.some((id) => id.equals(req.user?._id));
  res.render('yards/show.ejs', { yard, isFavored });
});

// Edit
router.get('/:id/edit', ensureLoggedIn, async (req, res) => {
  const yard = await Yard.findById(req.params.id).populate('trees');
  const statuses = Yard.schema.path('status').enumValues;
  res.render('yards/edit.ejs', { yard, statuses });
});

// Update
router.put('/:id', async (req, res) => {
  const yard = await Yard.findByIdAndUpdate(req.params.id, req.body);
  res.redirect(`/yards/${req.params.id}`);
});

// Delete
router.delete('/:id', async (req, res) => {
  const yard = await Yard.findByIdAndDelete(req.params.id);
  res.redirect('/yards');
});


// Favorites

// POST /yards/:id/favorites
router.post('/:id/favorites', ensureLoggedIn, async (req, res) => {
  const yard = await Yard.findById(req.params.id);
  const user = await User.findOne({ _id: req.user._id });
  yard.favoritedBy.push(user._id);
  await yard.save();
  res.redirect(`/yards/${req.params.id}`);
});


// DELETE /yards/:id/favorites
router.delete('/:id/favorites', ensureLoggedIn, async (req, res) => {
  await Yard.findByIdAndUpdate(
    req.params.id,
    { $pull: { favoritedBy: req.user._id } }
  );
  res.redirect(`/yards/${req.params.id}`);
});

// Comments
router.post('/:id/comments', ensureLoggedIn, async (req, res) => {
  try {
    req.body.user = req.user._id;
    await Yard.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: req.body } }
    );
    console.log('req.body log',req.body);
    res.redirect(`/yards/${req.params.id}`);
  } catch (err) {
    console.log(err);
    res.redirect(`/yards/${req.params.id}`);
  }
});

module.exports = router;
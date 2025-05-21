const express = require('express');
const router = express.Router();


// Middleware used to protect routes that need a logged in user
const ensureLoggedIn = require('../middleware/ensure-logged-in');
const Yard = require('../models/yard');
const User = require('../models/user');
const Tree = require('../models/tree');


// This is how we can more easily protect ALL routes for this router
// router.use(ensureLoggedIn);

// ALL paths start with '/yards'

// index action
router.get('/', ensureLoggedIn, async (req, res) => {
  const trees = await Tree.find({});
  const yards = await Yard.find({});
  console.log(yards)
  res.render('yards/index.ejs', { yards, trees });
});
// GET /yards/new
router.get('/new', ensureLoggedIn, async (req, res) => {
  const trees = await Tree.find({});
  res.render('yards/new.ejs', { trees });
});

// create
router.post('/', async (req, res) => {
  const user = await User.findOne({ _id: req.user._id })
  const yard = await Yard.create(req.body)
  user.yards.push(yard._id)
  await user.save()
  console.log('yards', yard);
  res.redirect('/yards');
});

// show
router.get('/:id', async (req, res) => {
  const yard = await Yard.findById(req.params.id).populate('trees');
  const isFavored = yard.favoritedBy.some((id) => id.equals(req.user?._id));
  res.render('yards/show.ejs', { yard, isFavored });
});

// Edit
router.get('/:id/edit', async (req, res) => {
  const yard = await Yard.findById(req.params.id).populate('trees');
  const statuses = Yard.schema.path('status').enumValues;
  console.log('This is the message',yard);
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

module.exports = router;
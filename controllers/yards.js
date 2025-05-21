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

router.post('/', async (req, res) => {
  const user = await User.findOne({ _id: req.user._id })
  const yard = await Yard.create(req.body)
  console.log(user);
  user.yards.push(yard._id)
  await user.save()
  res.redirect('/yards');
});

// show
router.get('/:id', async (req, res) => {
  const yard = await Yard.findById(req.params.id).populate('trees');
  res.render('yards/show.ejs', { yard });
});

// Edit
router.get('/:id/edit', async (req, res) => {
  const yard = await Yard.findById(req.params.id);
  const statuses = User.schema.path('yards').schema.path('status').enumValues;
  res.render('yards/edit.ejs', { yard, statuses });
});

// Update
router.put('/:id', async (req, res) => {
  const yard = await Yard.findById(req.params.id);
  Object.assign(yard, req.body);
  await req.user.save();
  res.redirect(`/yards/${req.params.id}`);
});

// Delete
router.delete('/:id', async (req, res) => {
  req.user.yards.remove(req.params.id);
  await req.user.save();
  res.redirect('/yards');
});

module.exports = router;
const express = require('express');
const router = express.Router();


// Middleware used to protect routes that need a logged in user
const ensureLoggedIn = require('../middleware/ensure-logged-in');
const yard = require('../models/yard');
const User = require('../models/user');

// This is how we can more easily protect ALL routes for this router
// router.use(ensureLoggedIn);

// ALL paths start with '/yards'

// index action
router.get('/', (req, res) => {
  const yards = yard.find({})
  res.render('yards/index.ejs', { yards });
});
// GET /yards/new
router.get('/new', ensureLoggedIn, (req, res) => {
  res.render('yards/new.ejs');
});

// create the tree,using the req.body
// find the yard by it's Id off of the req.user.yard
// push the tree._id inside the req.user.yard.push(tree_id)
// then save the req.user
router.post('/', async (req, res) => {
  req.user.yards.push(req.body);
  await req.user.save();
  res.redirect('/yards');
});

router.get('/:id', (req, res) =>{
  const yard = req.user.yards.id(req.params.id);
  res.render('yards/show.ejs', { yard });
});

// Edit
router.get('/:id/edit', (req, res) => {
  console.log('This is req.user',req.user);
  const yard = req.user.yards.id(req.params.id);
  const statuses = User.schema.path('yards').schema.path('status').enumValues;
  res.render('yards/edit.ejs', { yard, statuses });
});

// Update
router.put('/:id', async (req, res) => {
  const yard = req.user.yards.id(req.params.id);
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
const express = require('express');
const router = express.Router();

// Middleware used to protect routes that need a logged in user
const ensureLoggedIn = require('../middleware/ensure-logged-in');

// This is how we can more easily protect ALL routes for this router
// router.use(ensureLoggedIn);

// ALL paths start with '/yards'

// index action
router.get('/', (req, res) => {
  res.render('yards/index.ejs');
});
// GET /yards/new
router.get('/new', ensureLoggedIn, (req, res) => {
  res.render('yards/new.ejs');
});

// POST /yards
router.post('/', async (req, res) => {
  req.user.yards.push(req.body);
  await req.user.save();
  res.redirect('/yards');
});



module.exports = router;
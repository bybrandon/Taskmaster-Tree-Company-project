const express = require('express');
const router = express.Router();

// Middleware used to protect routes that need a logged in user
const ensureLoggedIn = require('../middleware/ensure-logged-in');

// This is how we can more easily protect ALL routes for this router
// router.use(ensureLoggedIn);

// ALL paths start with '/trees'

// index action
router.get('/', (req, res) => {
  res.send('List of all trees - not protected');
});
// GET /trees/new
router.get('/new', ensureLoggedIn, (req, res) => {
  res.send('Create a Tree!');
});

router.

module.exports = router;
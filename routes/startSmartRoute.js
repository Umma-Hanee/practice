// routes/startSmartRoute.js
const express = require('express');
const router = express.Router();

const startSmartController = require('../controllers/startSmartController');

// Route for the index page
router.get('/', startSmartController.showIndexPage);

// Route for the funding page
router.get('/funding', startSmartController.showFundingPage);

// Route for the about page
router.get('/about', startSmartController.showAboutPage);

module.exports = router;

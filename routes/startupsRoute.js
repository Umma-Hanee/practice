const express = require('express');
const router = express.Router();
const startupsController = require('../controllers/startupsController');

// Get all startups
router.get('/startups', startupsController.getAllStartups);

// Get startup by ID
router.get('/startups/:id', startupsController.getStartupById);

// Create a new startup
router.post('/startups', startupsController.createStartup);

// Signup as a startup
router.get('/startup_register', startupsController.showStartupSignupForm);
router.post('/startup_register', startupsController.startupSignup);


// Display startup login form
router.get('/startup_login', startupsController.showLoginForm);
router.post('/startup_login', startupsController.loginStartup);

// Display the startup dashboard
router.get('/startup_dashboard', startupsController.showStartupDashboard);


// Display all consulatnts
router.get('/all_consultants', startupsController.getAllConsultants);

// Display recommended consultants
router.get("/recommended_consultants", startupsController.showRecommendedConsultants);

// Route to display consultant projects for a specific consultant
router.get('/consultants/:consultantEmail/projects', startupsController.getRecommendedConsultantProjects);

// Update a startup
router.put('/startups/:id', startupsController.updateStartup);

// Delete a startup
router.delete('/startups/:id', startupsController.deleteStartup);

// Logout
router.get('/startup_logout', startupsController.logoutStartup);


module.exports = router;

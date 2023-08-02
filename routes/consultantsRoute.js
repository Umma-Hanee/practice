const express = require('express');
const router = express.Router();
const consultantsController = require('../controllers/consultantsController');

// Get all consultants
router.get('/consultants', consultantsController.getAllConsultants);

// Get consultant by ID
router.get('/consultants/:id', consultantsController.getConsultantById);

// Create a new consultant
router.post('/consultants', consultantsController.createConsultant);

// Signup as a consultant
router.get('/con_register', consultantsController.showConsultantSignupForm);
router.post('/con_register', consultantsController.consultantSignup);

// Login as a consultant 
router.get('/con_login', consultantsController.showConsultantLoginForm);
router.post('/con_login', consultantsController.loginConsultant);

// Display the consultant dashboard
router.get('/con_dashboard', consultantsController.dashboard);

// Display consultant profile
router.get('/profile/:consultantEmail', consultantsController.showConsultantProfile);  
router.post('/profile/:consultantEmail', consultantsController.updateConsultantProfile);

// Display consultant projects
router.get('/:consultantEmail/projects', consultantsController.showConsultantProjects);

// Route to handle project creation form submission
router.post('/:consultantEmail/projects/create', consultantsController.createConsultantProject);

// Define routes for project deletion and update
router.get('/:consultantEmail/projects/:projectId/delete', consultantsController.deleteConsultantProject);
router.post('/:consultantEmail/projects/:projectId/edit', consultantsController.updateConsultantProject);

// Logout
router.get('/con_logout', consultantsController.logoutConsultant);


module.exports = router;

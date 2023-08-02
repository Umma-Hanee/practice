const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = require("firebase/auth");
const admin = require('firebase-admin');
const { initializeApp } = require("firebase/app");
const { getFirestore } = require('firebase-admin/firestore');
const { createCompletion } = require('./ai');

// Initialize Firebase Admin SDK
const serviceAccount = require('../startsmartng-fe2b5-firebase-adminsdk-45v24-b02cb74d3d.json');
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB17_BZo4NJOIMAK_dGlqSjMCmE97DvCzE",
  authDomain: "startsmart2-74d17.firebaseapp.com",
  projectId: "startsmart2-74d17",
  storageBucket: "startsmart2-74d17.appspot.com",
  messagingSenderId: "420007994423",
  appId: "1:420007994423:web:f2072b7aeb154f0f50cbb2"
};

// Initialize Firebase client SDK
const app = initializeApp(firebaseConfig);
const auth = getAuth();

// Rest of your code...
const db = admin.firestore();
const collectionRef = db.collection('startps');
const consultantCollectionRef = db.collection('consultants');

// Get all startups
const getAllStartups = (req, res) => {
  collectionRef
    .get()
    .then((snapshot) => {
      const startups = [];
      snapshot.forEach((doc) => {
        startups.push({ id: doc.id, ...doc.data() });
      });
      res.json(startups);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to fetch startups' });
    });
};

// Get startup by ID
const getStartupById = (req, res) => {
  const startupId = req.params.id;
  const documentRef = collectionRef.doc(startupId);
  documentRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        res.json({ id: doc.id, ...doc.data() });
      } else {
        res.status(404).json({ error: 'Startup not found' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to fetch startup' });
    });
};

// Create a new startup
const createStartup = (req, res) => {
  const startupData = req.body;
  console.log(
    startupData
  )
};

// Signup as a startup - Show signup form
const showStartupSignupForm = (req, res) => {
  res.render('startups/startup_register'); // Assuming you are using a templating engine like Mustache or EJS
};

// Signup as a startup - Handle signup form submission
const startupSignup = async (req, res) => {
  try {
    const startupData = req.body;
    const { name, email, password, category, company } = startupData; // Destructure the startupData object

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Signed up successfully
    const user = userCredential.user;

    const docRef = db.collection('startups').doc(email);
    const startupRef = db.collection(`startup_${category}`).doc(email)
    const newStartup = {
      name,
      email: email,
      category, // Add the category field
      company, // Add the company field
      // Add any other relevant startup data
    };

    await docRef.set(newStartup);
    await startupRef.set(newStartup);
    const response = { id: docRef.id, ...newStartup };
    console.log(response); // Log the response to the terminal
    res.redirect(`/startups/startup_dashboard?company=${company}&category=${category}`);
  } catch (error) {
    // Error handling code
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode); // Log the error code to the terminal
    console.log(errorMessage); // Log the error message to the terminal

    // Handle the specific error case for email already in use
    if (errorCode === 'auth/email-already-in-use') {
      res.status(400).json({ error: 'Email address is already in use. Please log in or use a different email address.' });
    } else {
      res.status(500).json({ error: 'Failed to create consultant' });
    }
  }
};

// Display the startup login form
const showLoginForm = (req, res) => {
  res.render('startups/startup_login'); // Assuming you are using a templating engine like Mustache or EJS
};

// Handle startup login form submission
const loginStartup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Authenticate the startup using Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const startupRef = db.collection('startups').doc(email);
    const doc = await startupRef.get();
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      console.log('Document data:', doc.data());
      res.redirect(`/startups/startup_dashboard?company=${doc.data().company}&category=${doc.data().category}`);
    }
    // Redirect to the startup dashboard or any other page after successful login
  } catch (error) {
    // Error handling code
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode); // Log the error code to the terminal
    console.log(errorMessage); // Log the error message to the terminal

    // Handle login failure (e.g., incorrect credentials)
    res.status(401).render('startups/startup_login', { error: 'Invalid email or password' });
  }
};

// Assuming you have imported the necessary modules and defined the Startup model
// Display the startup dashboard
const showStartupDashboard = async (req, res) => {
  try {
    // Get the startup name and category from the logged-in user data
    const startupName = req.query.company; // Replace "name" with the actual property that contains the startup's name
    const startupCategory = req.query.category; // Replace "category" with the actual property that contains the startup's category

    // You can fetch additional consultant data or information from your database if needed
    const snapshot = await db.collection(`consultant_${startupCategory}`).get();
    const allDocuments = snapshot.docs.map((doc) => doc.data());
    console.log(allDocuments);

    // Pass the consultant data as an object when rendering the view
    const startupData = {
      startupName,
      startupCategory,
      // Add any other relevant consultant data that you want to display on the dashboard
    };

    const data = { startupData };
    console.log(data);

    // Render the view with the data
    res.render('startups/startup_dashboard', data);
  } catch (error) {
    // Handle errors here
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch startup data' });
  }
};

// Function to show recommended consultants
const showRecommendedConsultants = async (req, res) => {
  try {
    const startupName = req.query.company;
    const startupCategory = req.query.category;
    const email = req.query.email;
    const numberOfRuns = 5;

    // Fetch the recommended consultants based on the startup's category from the database
    const snapshot = await db.collection(`consultant_${startupCategory}`).get();
    const allDocuments = snapshot.docs.map((doc) => doc.data());
    const recommendedConsultants = allDocuments.map((doc) => ({
      consultantName: doc.name,
      expertise: doc.category,
      email: doc.email,
    }));

    const results = [];

    // Function to run the AI recommendation process with rate limiting
    const runRecommendationProcess = async () => {
      // Use the recommendedConsultants data for AI recommendation logic
      const recommendedConsultantsAI = recommendedConsultants;

      // Add AI recommendation logic here, if needed
      // For example, you can shuffle the array or apply some recommendation algorithm
      // In this case, we will use the AI function to generate the recommendations

      // Create a prompt for the AI model based on the startup's category
      const prompt = `For your startup ${startupName}, we recommend the following consultants: ${recommendedConsultantsAI
        .map((consultant) => consultant.consultantName)
        .join(', ')}.`;

      // Call the AI function from ai.js to get recommendations
      const response = await createCompletion(prompt);

      // Use the AI-generated response as the new list of recommended consultants
      const newRecommendedConsultants = response ? response.split(', ') : [];

      // Return the AI-recommended consultants
      return newRecommendedConsultants;
    };

    // Function to add a delay between API calls
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // Loop to run the AI recommendation process multiple times with delay between API calls
    for (let i = 0; i < numberOfRuns; i++) {
      const consultants = await runRecommendationProcess();
      results.push(consultants);
      // Add a delay of 1 second between API calls to avoid rate limiting
      await wait(1000);
    }

    const data = {
      startupName,
      startupCategory,
      email,
      recomm: recommendedConsultants, // Use the original recommendedConsultants data
      recommendedConsultantsAI: results, // Use the AI-generated recommendations
    };

    // Render the view with the data
    res.render('startups/recommended_consultants', data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch recommended consultants data' });
  }
};


// Get consultant projects for the logged-in startup
const getRecommendedConsultantProjects = async (req, res) => {
  try {
    const consultantEmail = req.params.consultantEmail;
    console.log('Consultant Email:', consultantEmail);

    // Fetch the consultant's projects from Firebase based on their email
    const consultantProjectsSnapshot = await db
      .collection('consultants')
      .doc(consultantEmail)
      .collection('projects')
      .get();

    const consultantProjects = consultantProjectsSnapshot.docs.map((doc) => doc.data());
    console.log('Consultant Projects:', consultantProjects);


    // Fetch the consultant's name from Firebase or your database (adjust the field accordingly)
    const consultantSnapshot = await db.collection('consultants').doc(consultantEmail).get();
    const consultantData = consultantSnapshot.data();
    const consultantName = consultantData.name; // Replace "name" with the actual property that contains the consultant's name


    // Render the projects view with the consultant's projects data
    res.render('startups/consultant_projects', {
      consultantEmail,
      consultantName,
      projects: consultantProjects,
    });
  } catch (error) {
    console.error('Error fetching consultant projects:', error);
    res.status(500).json({ error: 'Failed to fetch consultant projects' });
  }
};



// Display all consultants
const getAllConsultants = async (req, res) => {
  try {
    const snapshot = await db.collection('consultants').get();
    const allConsultants = snapshot.docs.map((doc) => doc.data());
console.log(allConsultants)
    // Pass the data as an object when rendering the view
    res.render('startups/all_consultants', { allConsultants });
  } catch (error) {
    // Handle errors here
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch consultant data' });
  }
};



// Update a startup
const updateStartup = (req, res) => {
  const startupId = req.params.id;
  const updatedData = req.body;
  const documentRef = collectionRef.doc(startupId);
  documentRef
    .update(updatedData)
    .then(() => {
      res.json({ message: 'Startup updated successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to update startup' });
    });
};

// Delete a startup
const deleteStartup = (req, res) => {
  const startupId = req.params.id;
  const documentRef = collectionRef.doc(startupId);
  documentRef
    .delete()
    .then(() => {
      res.json({ message: 'Startup deleted successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to delete startup' });
    });
};

// Handle startup logout
const logoutStartup = async (req, res) => {
  try {
    // Use Firebase Auth to sign out the user
    await signOut(auth);
    res.redirect('/'); // Redirect to the login page after successful logout
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
};



module.exports = {
  getAllStartups,
  getStartupById,
  createStartup,
  showStartupSignupForm,
  startupSignup,
  showLoginForm,
  loginStartup,
  showStartupDashboard,
  showRecommendedConsultants,
  getRecommendedConsultantProjects,
  getAllConsultants,
  updateStartup,
  deleteStartup,
  logoutStartup,
};

const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = require("firebase/auth");
const admin = require('firebase-admin');
const { initializeApp } = require("firebase/app");
const { getFirestore } = require('firebase-admin/firestore');
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
const auth = getAuth(app);

// Rest of your code...
const db = getFirestore();
const consultantsRef = db.collection('consultants');
const projectsRef = db.collection('projects');

// Get all consultants
const getAllConsultants = (req, res) => {
  // Logic to retrieve all consultants from the database
  // Replace the example code with your actual logic
  consultantsRef.get()
    .then((snapshot) => {
      const consultants = [];
      snapshot.forEach((doc) => {
        consultants.push(doc.data());
      });
      res.json(consultants);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to fetch consultants' });
    });
};

// Get consultant by ID
const getConsultantById = (req, res) => {
  const consultantId = req.params.id;
  // Logic to retrieve a specific consultant by ID from the database
  // Replace the example code with your actual logic
  consultantsRef.doc(consultantId).get()
    .then((doc) => {
      if (!doc.exists) {
        res.status(404).json({ error: 'Consultant not found' });
      } else {
        res.json(doc.data());
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to fetch consultant' });
    });
};

// Create a new consultant
const createConsultant = (req, res) => {
  const consultantData = req.body;

  createUserWithEmailAndPassword(auth, consultantData.email, consultantData.password)
    .then((userCredential) => {
      // Signed up successfully
      const user = userCredential.user;
      // Save the consultant data to the database or perform any other required actions
      // For example, you can create a new document in a "consultants" collection in Firestore
      const newConsultant = {
        name: consultantData.name, // Make sure "name" field is properly populated
        email: consultantData.email,
        // Add any other relevant consultant data
      };
      consultantsRef.add(newConsultant)
        .then((docRef) => {
          const response = { id: docRef.id, ...newConsultant };
          console.log(response); // Log the response to the terminal
        })
        .catch((error) => {
          console.log(error); // Log the error to the terminal
          res.status(500).json({ error: 'Failed to create consultant' });
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode); // Log the error code to the terminal
      console.log(errorMessage); // Log the error message to the terminal
      res.status(500).json({ error: 'Failed to create consultant' });
    });
};


// Signup as a consultant - Show signup form
const showConsultantSignupForm = (req, res) => {
  res.render('consultants/con_register');
};

// Signup as a consultant - Handle signup form submission
const consultantSignup = async (req, res) => {
  try {
    const consultantData = req.body;
    const userCredential = await createUserWithEmailAndPassword(auth, consultantData.email, consultantData.password);
    // Signed up successfully
    const user = userCredential.user;
    // console.log(user);
    const docRef = db.collection('consultants').doc(user.email);
    const categoryRef = db.collection(`consultant_${consultantData.category}`).doc(user.email)
    // Save the consultant data to the database or perform any other required actions
    // For example, you can create a new document in a "consultants" collection in Firestore
    const newConsultant = {
      name: consultantData.name,
      email: user.email,
      category: consultantData.category
      // Add any other relevant consultant data
    };
    await docRef.set(newConsultant);
    await categoryRef.set(newConsultant);
    const response = { id: docRef.id, ...newConsultant };
    console.log(response); // Log the response to the terminal
    res.redirect(`/consultants/con_dashboard?name=${consultantData.name}&email=${user.email}&category=${consultantData.category}`);
  } catch (error) {
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


// Display the consultant login form
const showConsultantLoginForm = (req, res) => {
  res.render('consultants/con_login');
};

// Handle consultant login form submission
const loginConsultant =async (req, res) => {
  // Process the login credentials and authenticate the consultant
  // Redirect to the consultant details page or display an error
  try {
    const { email, password } = req.body;

    // Authenticate the startup using Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const consultantRef = db.collection('consultants').doc(email);
    const doc = await consultantRef.get();
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      console.log('Document data:', doc.data());
      res.redirect(`/consultants/con_dashboard?name=${doc.data().name}&email=${doc.data().email}&category=${doc.data().category}`);
    }
    // Redirect to the startup dashboard or any other page after successful login
  } catch (error) {
    // Error handling code
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode); // Log the error code to the terminal
    console.log(errorMessage); // Log the error message to the terminal

    // Handle login failure (e.g., incorrect credentials)
    res.status(401).render('consultants/con_login', { error: 'Invalid email or password' });
  }
};

// Consultant Dashboard
const dashboard = (req, res) => {
  // Get consultant data from the query parameters
  const consultantName = req.query.name;
  const consultantEmail = req.query.email;
  const consultantCategory = req.query.category;

  // You can fetch additional consultant data or information from your database if needed

  // Pass the consultant data as an object when rendering the view
  const consultantData = {
    consultantName,
    consultantEmail,
    consultantCategory,
        // Add any other relevant consultant data that you want to display on the dashboard
  };

  res.render('consultants/con_dashboard', consultantData);
};

// Display consultant profile
const showConsultantProfile = async (req, res) => {
  try {
    const consultantEmail = req.params.consultantEmail;
    console.log(consultantEmail)
    // Retrieve consultant data from the database (adjust this according to your database structure)
    const consultantDoc = await db.collection('consultants').doc(consultantEmail).get();
    const consultantData = consultantDoc.data();
console.log(consultantData)
    // Render the Mustache template with the consultant data
    res.render('consultants/consultant_profile', {consultantData});
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch consultant profile' });
  }
};

// Update consultant profile
const updateConsultantProfile = async (req, res) => {
  try {
    const consultantEmail = req.params.consultantEmail;
    console.log(consultantEmail);
    // Assuming you have the updated profile data in req.body
    const { category } = req.body;
    const updateProfileData = req.body;
    // Update the consultant profile in the database (adjust this according to your database structure)
    //await db.collection('consultants').doc(consultantEmail).update(updatedProfile);
    const cityRef = await db.collection('consultants').doc(consultantEmail);
    await db.collection(`consultant_${category}`).doc(consultantEmail).delete();
    const categoryRef = await db.collection(`consultant_${category}`).doc(consultantEmail);
    // Set the 'category' field of the city
    const updateCityResult = await cityRef.update({ category });
    await categoryRef.set(updateProfileData);
    console.log(updateCityResult);

    // Redirect to the specific consultant dashboard after the profile is updated
    res.redirect(`/consultants/con_dashboard?email=${consultantEmail}&name=${encodeURIComponent(updateProfileData.name)}&category=${encodeURIComponent(updateProfileData.category)}`);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update consultant profile' });
  }
};

// Handle project creation form submission
const createConsultantProject = async (req, res) => {
  try {
    const consultantEmail = req.params.consultantEmail;
    const newProject = req.body;

    // Add the new project to the consultant's projects in the database
    const docRef = await db
      .collection('consultants')
      .doc(consultantEmail)
      .collection('projects')
      .add(newProject);

    const projectId = docRef.id;

    // Update the consultant's projects array to include the new project ID
    await db
      .collection('consultants')
      .doc(consultantEmail)
      .update({
        projects: admin.firestore.FieldValue.arrayUnion(projectId),
      });

    // Redirect back to the consultant's projects page
    res.redirect(`/consultants/${consultantEmail}/projects`);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add project' });
  }
};

// Display consultant projects
const showConsultantProjects = async (req, res) => {
  try {
    const consultantEmail = req.params.consultantEmail;

    // Fetch the consultant's projects from their individual database
    const consultantProjectsSnapshot = await db
      .collection('consultants')
      .doc(consultantEmail)
      .collection('projects')
      .get();

    const consultantProjects = consultantProjectsSnapshot.docs.map((doc) => doc.data());

    console.log(consultantProjects); // Add this log to check the data

    res.render('consultants/consultant_project', {
      consultantEmail,
      projects: consultantProjects,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch consultant projects' });
  }
};
// Delete a project for the consultant
const deleteConsultantProject = async (req, res) => {
  try {
    const consultantEmail = req.params.consultantEmail;
    const projectId = req.params.projectId;

    // Delete the project from the consultant's projects in the database
    await db
      .collection('consultants')
      .doc(consultantEmail)
      .collection('projects')
      .doc(projectId)
      .delete();

    // Redirect back to the consultant's projects page
    res.redirect(`/consultants/${consultantEmail}/projects`);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

// Update a project for the consultant
const updateConsultantProject = async (req, res) => {
  try {
    const consultantEmail = req.params.consultantEmail;
    const projectId = req.params.projectId;
    const updatedProject = req.body;

    // Update the project in the consultant's projects in the database
    await db
      .collection('consultants')
      .doc(consultantEmail)
      .collection('projects')
      .doc(projectId)
      .update(updatedProject);

    // Redirect back to the consultant's projects page
    res.redirect(`/consultants/${consultantEmail}/projects`);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
};

// Update a consultant
const updateConsultant = (req, res) => {
  const consultantId = req.params.id;
  const updatedData = req.body;
  const documentRef = consultantsRef.doc(consultantId);
  documentRef
    .update(updatedData)
    .then(() => {
      res.json({ message: 'Consultant updated successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to update consultant' });
    });
};

// Delete a consultant
const deleteConsultant = (req, res) => {
  const consultantId = req.params.id;
  const documentRef = consultantsRef.doc(consultantId);
  documentRef
    .delete()
    .then(() => {
      res.json({ message: 'Consultant deleted successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to delete consultant' });
    });
};


// Handle consultant logout
const logoutConsultant = async (req, res) => {
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
  getAllConsultants,
  getConsultantById,
  createConsultant,
  showConsultantSignupForm,
  consultantSignup,
  showConsultantLoginForm,
  loginConsultant,
  dashboard,
  showConsultantProfile,
  updateConsultantProfile,
  createConsultantProject,
  showConsultantProjects,
  updateConsultantProject,
  deleteConsultantProject,
  updateConsultant,
  deleteConsultant,
  logoutConsultant,
};

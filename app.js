const admin = require('firebase-admin');

const serviceAccount = require('./startsmartng-fe2b5-firebase-adminsdk-45v24-b02cb74d3d.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
const collectionRef = db.collection('startUps');

// Reading documents
const documentRef = collectionRef.doc('startupID');
documentRef.get()
  .then((doc) => {
    if (doc.exists) {
      console.log('Document data:', doc.data());
    } else {
      console.log('Document not found.');
    }
  })
  .catch((error) => {
    console.log('Error getting document:', error);
  });

// Creating a new document
const newData = {
  startup_name: 'startupA',
  category: 'fintech',
};

collectionRef.add(newData)
  .then((docRef) => {
    console.log('Document written with ID:', docRef.id);
  })
  .catch((error) => {
    console.log('Error adding document:', error);
  });

// Updating a document
const documentToUpdate = collectionRef.doc('documentId');
const updatedData = {
    startup_name: 'startupB',
    category: 'e-health',
};

documentToUpdate.update(updatedData)
  .then(() => {
    console.log('Document updated successfully.');
  })
  .catch((error) => {
    console.log('Error updating document:', error);
  });

// Deleting a document
const documentToDelete = collectionRef.doc('documentId');

documentToDelete.delete()
  .then(() => {
    console.log('Document deleted successfully.');
  })
  .catch((error) => {
    console.log('Error deleting document:', error);
  });
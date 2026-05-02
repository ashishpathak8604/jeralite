const admin = require('firebase-admin');

// Ensure that you have the serviceAccountKey.json file in the server/config directory or specify path in .env
try {
  const serviceAccount = require('../serviceAccountKey.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('Firebase Admin Initialized');
} catch (error) {
  console.warn('Firebase Admin Initialization Warning: serviceAccountKey.json not found or invalid. Authentication will fail until this is configured.');
}

module.exports = admin;

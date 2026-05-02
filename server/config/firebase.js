const admin = require('firebase-admin');

// Ensure that you provide the FIREBASE_SERVICE_ACCOUNT environment variable in production
// Or have the serviceAccountKey.json file in the server directory for local development
try {
  let serviceAccount;

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Railway/Production environment
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    // Local development
    serviceAccount = require('../serviceAccountKey.json');
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('Firebase Admin Initialized Successfully');
} catch (error) {
  console.warn('Firebase Admin Initialization Warning: Firebase credentials not found or invalid. Authentication will fail.');
  console.error(error.message);
}

module.exports = admin;

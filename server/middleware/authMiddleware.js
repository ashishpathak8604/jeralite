const admin = require('../config/firebase');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // 🔥 ADD LOG
      console.log("Incoming Token:", token ? "YES" : "NO");

      const decodedToken = await admin.auth().verifyIdToken(token);

      console.log("Decoded UID:", decodedToken.uid);

      let user = await User.findOne({ firebaseUid: decodedToken.uid });

      if (!user) {
        user = await User.create({
          firebaseUid: decodedToken.uid,
          email: decodedToken.email,
          name:
            decodedToken.name ||
            decodedToken.email.split('@')[0],
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Token Verification Error:", error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.log("No Authorization header found");
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
const crypto = require('crypto');

// Secret code for admin access
const ADMIN_SECRET = '12#$#WDDFF#$%%%####diuefcb';

// Hash the secret for comparison (one-way encryption)
const hashSecret = (secret) => {
  return crypto.createHash('sha256').update(secret).digest('hex');
};

// Store hashed secret
const HASHED_SECRET = hashSecret(ADMIN_SECRET);

// Middleware to verify admin secret code
const verifyAdminSecret = (req, res, next) => {
  const secret = req.query.secret || req.headers['x-admin-secret'] || req.body.secret;
  
  if (!secret) {
    return res.status(403).json({
      success: false,
      message: 'Admin secret code required'
    });
  }

  // Hash the provided secret and compare
  const hashedInput = hashSecret(secret);
  
  if (hashedInput !== HASHED_SECRET) {
    return res.status(403).json({
      success: false,
      message: 'Invalid admin secret code'
    });
  }

  // Store in request for later use
  req.adminSecretVerified = true;
  next();
};

// Generate encrypted token for admin routes (for frontend use)
const generateAdminToken = () => {
  const timestamp = Date.now();
  const data = `${ADMIN_SECRET}:${timestamp}`;
  return crypto.createHash('sha256').update(data).digest('hex');
};

module.exports = {
  verifyAdminSecret,
  generateAdminToken,
  ADMIN_SECRET
};


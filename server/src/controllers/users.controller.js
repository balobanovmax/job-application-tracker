const db = require('../db/queries');


const getCurrentUser = async (req, res, next) => {
  try {
    // Extract Auth0 user info from the JWT token
    const auth0Id = req.auth.payload.sub;
    
    // Try multiple sources for email
    const email = req.auth.payload.email 
      || req.auth.payload.name 
      || req.auth.payload.nickname
      || `${auth0Id.split('|')[1]}@auth0.user`;

    console.log('Auth0 Payload:', {
      sub: auth0Id,
      email: req.auth.payload.email,
      name: req.auth.payload.name,
      nickname: req.auth.payload.nickname,
      fullPayload: req.auth.payload
    });

    if (!auth0Id) {
      return res.status(400).json({ 
        error: 'Missing user identifier' 
      });
    }

    if (!email) {
      return res.status(400).json({ 
        error: 'Missing email from Auth0 token',
        hint: 'Make sure email scope is requested in Auth0'
      });
    }

    // Find or create user in database
    const user = await db.findOrCreateUser(auth0Id, email);

    res.json({
      success: true,
      user: {
        id: user.id,
        auth0_id: user.auth0_id,
        email: user.email,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    next(error);
  }
};

module.exports = {
  getCurrentUser
};


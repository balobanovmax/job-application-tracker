const db = require('../db/queries');
const { extractAuthUser } = require('../utils/authUser');

const getCurrentUser = async (req, res, next) => {
  try {
    const { auth0Id, email } = extractAuthUser(req.auth.payload);

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


const db = require('../db/queries');

function extractAuthUser(payload) {
  const auth0Id = payload.sub;
  const email = payload.email
    || payload.name
    || payload.nickname
    || (auth0Id ? `${auth0Id.split('|')[1]}@auth0.user` : null);

  return { auth0Id, email };
}

async function findOrCreateUserFromAuth(payload) {
  const { auth0Id, email } = extractAuthUser(payload);

  if (!auth0Id) {
    const error = new Error('Missing user identifier');
    error.status = 400;
    throw error;
  }

  return db.findOrCreateUser(auth0Id, email);
}

module.exports = { extractAuthUser, findOrCreateUserFromAuth };

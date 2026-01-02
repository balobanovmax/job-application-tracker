const pool = require('./index');

const findUserByAuth0Id = async (auth0Id) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE auth0_id = $1',
    [auth0Id]
  );
  return result.rows[0];
};

const createUser = async (auth0Id, email) => {
  const result = await pool.query(
    'INSERT INTO users (auth0_id, email) VALUES ($1, $2) RETURNING *',
    [auth0Id, email]
  );
  return result.rows[0];
};

const findOrCreateUser = async (auth0Id, email) => {
  let user = await findUserByAuth0Id(auth0Id);
  if (!user) {
    user = await createUser(auth0Id, email);
  }
  return user;
};


const getApplicationsByUserId = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM applications WHERE user_id = $1 ORDER BY date_applied DESC, created_at DESC',
    [userId]
  );
  return result.rows;
};


const getApplicationById = async (applicationId, userId) => {
  const result = await pool.query(
    'SELECT * FROM applications WHERE id = $1 AND user_id = $2',
    [applicationId, userId]
  );
  return result.rows[0];
};

const getApplicationByCompany = async (company, userId) => {
  const result = await pool.query(
    'SELECT * FROM applications WHERE company = $1 AND user_id = $2',
    [company, userId]
  );
  return result.rows[0];
};

const getApplicationByRole = async (role, userId) => {
  const result = await pool.query(
    'SELECT * FROM applications WHERE role = $1 AND user_id = $2',
    [role, userId]
  );
  return result.rows[0];
};

const getApplicationByStatus = async (status, userId) => {
  const result = await pool.query(
    'SELECT * FROM applications WHERE status = $1 AND user_id = $2',
    [status, userId]
  );
  return result.rows[0];
};

const getApplicationByDateApplied = async (dateApplied, userId) => {
  const result = await pool.query(
    'SELECT * FROM applications WHERE date_applied = $1 AND user_id = $2',
    [dateApplied, userId]
  );
  return result.rows[0];
};

const createApplication = async (userId, company, role, status, dateApplied, notes, applicationUrl) => {
  const result = await pool.query(
    `INSERT INTO applications (user_id, company, role, status, date_applied, notes, application_url) 
     VALUES ($1, $2, $3, $4, $5, $6, $7) 
     RETURNING *`,
    [userId, company, role, status || 'applied', dateApplied || new Date(), notes || null, applicationUrl || null]
  );
  return result.rows[0];
};


const updateApplication = async (applicationId, userId, updates) => {
  const { company, role, status, date_applied, notes, application_url } = updates;
  
  const result = await pool.query(
    `UPDATE applications 
     SET company = COALESCE($1, company),
         role = COALESCE($2, role),
         status = COALESCE($3, status),
         date_applied = COALESCE($4, date_applied),
         notes = COALESCE($5, notes),
         application_url = COALESCE($6, application_url)
     WHERE id = $7 AND user_id = $8
     RETURNING *`,
    [company, role, status, date_applied, notes, application_url, applicationId, userId]
  );
  return result.rows[0];
};


const deleteApplication = async (applicationId, userId) => {
  const result = await pool.query(
    'DELETE FROM applications WHERE id = $1 AND user_id = $2 RETURNING *',
    [applicationId, userId]
  );
  return result.rows[0];
};


const deleteAllApplications = async (userId) => {
  const result = await pool.query(
    'DELETE FROM applications WHERE user_id = $1 RETURNING *',
    [userId]
  );
  return result.rows;
};

module.exports = {
  findUserByAuth0Id,
  createUser,
  findOrCreateUser,
  getApplicationsByUserId,
  getApplicationById,
  getApplicationByCompany,
  getApplicationByRole,
  getApplicationByStatus,
  getApplicationByDateApplied,
  createApplication,
  updateApplication,
  deleteApplication,
  deleteAllApplications,
};


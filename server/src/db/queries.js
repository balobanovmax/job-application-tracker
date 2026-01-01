const pool = require('./index');


const findUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};


const createUser = async (email) => {
  const result = await pool.query(
    'INSERT INTO users (email) VALUES ($1) RETURNING *',
    [email]
  );
  return result.rows[0];
};


const findOrCreateUser = async (email) => {
  let user = await findUserByEmail(email);
  if (!user) {
    user = await createUser(email);
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

const createApplication = async (userId, company, role, status, dateApplied) => {
  const result = await pool.query(
    `INSERT INTO applications (user_id, company, role, status, date_applied) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING *`,
    [userId, company, role, status || 'applied', dateApplied || new Date()]
  );
  return result.rows[0];
};


const updateApplication = async (applicationId, userId, updates) => {
  const { company, role, status, date_applied } = updates;
  
  const result = await pool.query(
    `UPDATE applications 
     SET company = COALESCE($1, company),
         role = COALESCE($2, role),
         status = COALESCE($3, status),
         date_applied = COALESCE($4, date_applied)
     WHERE id = $5 AND user_id = $6
     RETURNING *`,
    [company, role, status, date_applied, applicationId, userId]
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
  findUserByEmail,
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


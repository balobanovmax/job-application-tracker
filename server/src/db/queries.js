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
    'SELECT * FROM applications WHERE user_id = $1 ORDER BY created_at DESC',
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

const createApplication = async (userId, company, role, status, dateApplied, notes, applicationUrl, starred) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      `INSERT INTO applications (user_id, company, role, status, date_applied, notes, application_url, starred) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [userId, company, role, status || 'applied', dateApplied || new Date(), notes || null, applicationUrl || null, starred || false]
    );
    const application = result.rows[0];

    await client.query(
      `INSERT INTO application_status_history (application_id, status, changed_at)
       VALUES ($1, $2, COALESCE($3::timestamp, NOW()))`,
      [application.id, application.status, dateApplied || null]
    );

    await client.query('COMMIT');
    return application;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};


const updateApplication = async (applicationId, userId, updates) => {
  const { company, role, status, date_applied, notes, application_url, starred } = updates;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const existingResult = await client.query(
      'SELECT * FROM applications WHERE id = $1 AND user_id = $2',
      [applicationId, userId]
    );
    const existingApp = existingResult.rows[0];
    if (!existingApp) {
      await client.query('ROLLBACK');
      return null;
    }

    const result = await client.query(
      `UPDATE applications 
       SET company = COALESCE($1, company),
           role = COALESCE($2, role),
           status = COALESCE($3, status),
           date_applied = COALESCE($4, date_applied),
           notes = COALESCE($5, notes),
           application_url = COALESCE($6, application_url),
           starred = CASE WHEN $7::boolean IS NULL THEN starred ELSE $7::boolean END
       WHERE id = $8 AND user_id = $9
       RETURNING *`,
      [company, role, status, date_applied, notes, application_url, starred, applicationId, userId]
    );
    const application = result.rows[0];

    if (status !== undefined && status !== existingApp.status) {
      await client.query(
        `INSERT INTO application_status_history (application_id, status, changed_at)
         VALUES ($1, $2, NOW())`,
        [applicationId, status]
      );
    }

    await client.query('COMMIT');
    return application;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getStatusHistoryByApplicationId = async (applicationId, userId) => {
  const result = await pool.query(
    `SELECT h.id, h.status, h.changed_at
     FROM application_status_history h
     INNER JOIN applications a ON a.id = h.application_id
     WHERE h.application_id = $1 AND a.user_id = $2
     ORDER BY h.changed_at ASC, h.id ASC`,
    [applicationId, userId]
  );
  return result.rows;
};

const deleteStatusHistoryByApplicationId = async (applicationId, userId) => {
  const result = await pool.query(
    `DELETE FROM application_status_history h
     USING applications a
     WHERE h.application_id = a.id
       AND h.application_id = $1
       AND a.user_id = $2
     RETURNING h.id`,
    [applicationId, userId]
  );
  return result.rowCount;
};

const updateStatusHistoryEntry = async (applicationId, historyId, userId, updates) => {
  const { status, changed_at } = updates;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const updateResult = await client.query(
      `UPDATE application_status_history h
       SET status = COALESCE($1, h.status),
           changed_at = COALESCE($2::timestamp, h.changed_at)
       FROM applications a
       WHERE h.application_id = a.id
         AND h.id = $3
         AND h.application_id = $4
         AND a.user_id = $5
       RETURNING h.*`,
      [status, changed_at, historyId, applicationId, userId]
    );

    if (!updateResult.rows[0]) {
      await client.query('ROLLBACK');
      return null;
    }

    const latestResult = await client.query(
      `SELECT status FROM application_status_history
       WHERE application_id = $1
       ORDER BY changed_at DESC, id DESC
       LIMIT 1`,
      [applicationId]
    );

    if (latestResult.rows[0]) {
      await client.query(
        `UPDATE applications SET status = $1 WHERE id = $2 AND user_id = $3`,
        [latestResult.rows[0].status, applicationId, userId]
      );
    }

    await client.query('COMMIT');
    return updateResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
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
  getStatusHistoryByApplicationId,
  deleteStatusHistoryByApplicationId,
  updateStatusHistoryEntry,
};


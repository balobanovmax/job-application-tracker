require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function runMigration() {
  try {
    console.log('Running migration: add_status_history.sql');

    const migrationPath = path.join(__dirname, 'src/db/migrations/add_status_history.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    await pool.query(sql);

    const countResult = await pool.query(
      'SELECT COUNT(*)::int AS count FROM application_status_history'
    );

    console.log('✅ Migration completed successfully!');
    console.log(`   ${countResult.rows[0].count} status history entries in database.`);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

runMigration();

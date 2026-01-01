require('dotenv').config();
const pool = require('./index');

async function setupTestUser() {
  try {
    const result = await pool.query(
      "INSERT INTO users (email) VALUES ('temp@example.com') ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email RETURNING *"
    );
    
    console.log('✓ Temp user ready:', result.rows[0]);
    console.log('\nUse this ID for testing:', result.rows[0].id);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

setupTestUser();


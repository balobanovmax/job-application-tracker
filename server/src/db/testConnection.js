require('dotenv').config();
const pool = require('./index');

if (process.env.NODE_ENV === 'production') {
  process.exit(1);
}


async function testConnection() {
  try {
    console.log('Testing database connection...\n');
    const result = await pool.query('SELECT NOW()');
    console.log('✓ Database connection successful!');
    console.log('✓ Current timestamp from database:', result.rows[0].now);
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    console.log('\n✓ Tables found:');
    tablesResult.rows.forEach(row => {
      console.log('  -', row.table_name);
    });
    console.log('\n--- Testing User Queries ---');
    const testEmail = 'test@example.com';
    await pool.query('DELETE FROM users WHERE email = $1', [testEmail]);
    const createResult = await pool.query(
      'INSERT INTO users (email) VALUES ($1) RETURNING *',
      [testEmail]
    );
    console.log('✓ Created test user:', createResult.rows[0]);
    const findResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [testEmail]
    );
    console.log('✓ Found test user:', findResult.rows[0]);
    console.log('\n--- Testing Application Queries ---');
    const appResult = await pool.query(
      `INSERT INTO applications (user_id, company, role, status, date_applied) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [createResult.rows[0].id, 'Test Company', 'Software Engineer', 'applied', new Date()]
    );
    console.log('✓ Created test application:', appResult.rows[0]);
    const appsResult = await pool.query(
      'SELECT * FROM applications WHERE user_id = $1',
      [createResult.rows[0].id]
    );
    console.log('✓ Retrieved applications for user:', appsResult.rows.length, 'found');
    await pool.query('DELETE FROM users WHERE email = $1', [testEmail]);
    console.log('\n✓ Cleaned up test data');
    
    console.log('\n All database tests passed\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Database test failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testConnection();


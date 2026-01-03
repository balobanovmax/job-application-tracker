require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function runMigration() {
  try {
    console.log('Running migration: add_starred_field.sql');
    
    const migrationPath = path.join(__dirname, 'src/db/migrations/add_starred_field.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    await pool.query(sql);
    
    console.log('✅ Migration completed successfully!');
    console.log('The "starred" column has been added to the applications table.');
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('⚠️  Column "starred" already exists. Skipping migration.');
    } else {
      console.error('❌ Migration failed:', error.message);
      throw error;
    }
  } finally {
    await pool.end();
  }
}

runMigration();


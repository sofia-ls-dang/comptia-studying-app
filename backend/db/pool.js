import pkg from 'pg';
import 'dotenv/config';

const { Pool } = pkg;

// pg's Pool automatically reads PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE
// from process.env, which dotenv loads from your .env file.
const pool = new Pool();

pool.on('error', (err) => {
  console.error('Unexpected error on idle Postgres client', err);
  process.exit(1);
});

export default pool;

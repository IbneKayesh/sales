import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Pool } = pg;

// Parse docs/db_info.txt to retrieve connection details
const dbInfoPath = path.resolve(process.cwd(), 'docs', 'db_info.txt');
let config = {
  host: '127.0.0.1',
  port: 5432,
  user: 'sgdpg',
  password: 'sgdpass',
  database: 'sgddb'
};

try {
  if (fs.existsSync(dbInfoPath)) {
    const fileContent = fs.readFileSync(dbInfoPath, 'utf8');
    const lines = fileContent.split('\n');
    lines.forEach(line => {
      const parts = line.split('=');
      if (parts.length === 2) {
        const key = parts[0].trim();
        const value = parts[1].trim();
        if (key === 'DB_HOST') config.host = value;
        if (key === 'DB_PORT') config.port = parseInt(value, 10);
        if (key === 'DB_USER') config.user = value;
        if (key === 'DB_PASS') config.password = value;
        if (key === 'DB_NAME') config.database = value;
      }
    });
    console.log('Successfully loaded DB configuration from docs/db_info.txt');
  } else {
    console.warn('docs/db_info.txt not found, using default PostgreSQL configuration.');
  }
} catch (error) {
  console.error('Error reading docs/db_info.txt:', error.message);
}

const pool = new Pool({
  host: config.host,
  port: config.port,
  user: config.user,
  password: config.password,
  database: config.database,
  // Add reasonable timeouts
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export const query = (text, params) => pool.query(text, params);
export default pool;

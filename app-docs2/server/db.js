import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || 'sgdpg',
  password: process.env.DB_PASS || 'sgdpass',
  database: process.env.DB_NAME || 'sgddb',
  max: 10,
  idleTimeoutMillis: 30000,
});


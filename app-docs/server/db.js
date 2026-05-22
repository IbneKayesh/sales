import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'sgdpg',
  password: 'sgdpass',
  database: 'sgddb',
  max: 10,
  idleTimeoutMillis: 30000,
});
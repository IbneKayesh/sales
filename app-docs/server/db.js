import pg from 'pg';

const { Pool, types } = pg;

// DATE
pg.types.setTypeParser(1082, (value) => value);

// TIMESTAMP WITHOUT TIME ZONE
pg.types.setTypeParser(1114, (value) => value);

// TIMESTAMP WITH TIME ZONE
pg.types.setTypeParser(1184, (value) => value);


export const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'sgdpg',
  password: 'sgdpass',
  database: 'appdoc',
  max: 10,
  idleTimeoutMillis: 30000,
});
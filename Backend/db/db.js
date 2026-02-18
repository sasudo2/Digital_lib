/**
 * Imports the Pool class from the 'pg' (node-postgres) module.
 * Pool is used to manage a pool of client connections to a PostgreSQL database,
 * allowing multiple concurrent queries without creating a new connection each time.
 */
const { Pool } = require('pg');

require("dotenv").config()

// takes the credentials from .env
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function connectToDB(){
  try{
    await pool.query('SELECT NOW()');
    console.log('Connected to PostgreSQL Database');
    await createTables();
  } catch (err) {
    console.error('unable to connect to the database: ', err);
  }
}

async function createTables(){
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      firstname VARCHAR(255) NOT NULL,
      lastname VARCHAR(255),
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      socket_id VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createCaptainsTable = `
    CREATE TABLE IF NOT EXISTS captains (
      id SERIAL PRIMARY KEY,
      firstname VARCHAR(255) NOT NULL,
      lastname VARCHAR(255),
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      socket_id VARCHAR(255),
      status VARCHAR(20) DEFAULT 'inactive' CHECK (status IN ('active', 'inactive')),
      vehicle_color VARCHAR(255) NOT NULL,
      vehicle_plate VARCHAR(255) NOT NULL,
      vehicle_capacity INTEGER NOT NULL CHECK (vehicle_capacity >= 1),
      vehicle_type VARCHAR(20) NOT NULL CHECK (vehicle_type IN ('car', 'motorcycle', 'auto')),
      location_lat FLOAT,
      location_lon FLOAT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  
  const createBlacklistTokensTable = `
    CREATE TABLE IF NOT EXISTS blacklist_tokens (
      id SERIAL PRIMARY KEY,
      token TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createUsersTable);
    await pool.query(createCaptainsTable);
    await pool.query(createBlacklistTokensTable);
    console.log('Tables created successfully');
  } catch (err) {
    console.error('Error creating tables:', err);
  }

}

module.exports = { pool, connectToDB}



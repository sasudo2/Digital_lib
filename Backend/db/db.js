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
      status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
      time_spent_minutes INTEGER DEFAULT 0,
      librarian_id INTEGER REFERENCES captains(id),
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
      status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createGenresTable = `
    CREATE TABLE IF NOT EXISTS genres (
      genre_id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createAuthorsTable = `
    CREATE TABLE IF NOT EXISTS authors (
      author_id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createPublishersTable = `
    CREATE TABLE IF NOT EXISTS publishers (
      publisher_id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      country VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createBooksTable = `
    CREATE TABLE IF NOT EXISTS books (
      book_id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      isbn VARCHAR(20) UNIQUE,
      publication_year INTEGER,
      book_url TEXT,
      archive_url TEXT,
      author_id INTEGER REFERENCES authors(author_id),
      genre_id INTEGER REFERENCES genres(genre_id),
      publisher_id INTEGER REFERENCES publishers(publisher_id),
      librarian_id INTEGER REFERENCES captains(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createReviewsTable = `
    CREATE TABLE IF NOT EXISTS reviews (
      review_id SERIAL PRIMARY KEY,
      book_id INTEGER NOT NULL REFERENCES books(book_id) ON DELETE CASCADE,
      reader_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      rating FLOAT CHECK (rating >= 0 AND rating <= 5),
      comment TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(book_id, reader_id)
    );
  `;

  const createBookUsageTable = `
    CREATE TABLE IF NOT EXISTS book_usage (
      usage_id SERIAL PRIMARY KEY,
      reader_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      book_id INTEGER NOT NULL REFERENCES books(book_id) ON DELETE CASCADE,
      librarian_id INTEGER REFERENCES captains(id),
      action_type VARCHAR(50),
      issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      return_date TIMESTAMP,
      duration_minutes INTEGER,
      status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'returned')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createAdminActionsTable = `
    CREATE TABLE IF NOT EXISTS admin_actions (
      action_id SERIAL PRIMARY KEY,
      reader_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      librarian_id INTEGER REFERENCES captains(id) ON DELETE SET NULL,
      action_type VARCHAR(255),
      action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      notes TEXT
    );
  `;

  const createUserReadBooksTable = `
    CREATE TABLE IF NOT EXISTS user_read_books (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      book_id INTEGER NOT NULL REFERENCES books(book_id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, book_id)
    );
  `;

  const createUserFavoriteBooksTable = `
    CREATE TABLE IF NOT EXISTS user_favorite_books (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      book_id INTEGER NOT NULL REFERENCES books(book_id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, book_id)
    );
  `;

  const createBookBorrowingHistoryTable = `
    CREATE TABLE IF NOT EXISTS book_borrowing_history (
      borrow_id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      book_id INTEGER NOT NULL REFERENCES books(book_id) ON DELETE CASCADE,
      librarian_id INTEGER REFERENCES captains(id),
      borrow_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      return_date TIMESTAMP,
      duration_days INTEGER,
      status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'returned'))
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
    await pool.query(createCaptainsTable);
    await pool.query(createUsersTable);
    await pool.query(createGenresTable);
    await pool.query(createAuthorsTable);
    await pool.query(createPublishersTable);
    await pool.query(createBooksTable);
    await pool.query(createReviewsTable);
    await pool.query(createBookUsageTable);
    await pool.query(createAdminActionsTable);
    await pool.query(createUserReadBooksTable);
    await pool.query(createUserFavoriteBooksTable);
    await pool.query(createBookBorrowingHistoryTable);
    await pool.query(createBlacklistTokensTable);
    console.log('All tables created successfully');
  } catch (err) {
    console.error('Error creating tables:', err);
  }

}

module.exports = { pool, connectToDB}



const fs = require('fs');
const path = require('path');
const { pool } = require('../db/db');

async function insertBooksFromJSON() {
  try {
    const filePath = path.join(__dirname, '../../', 'Dataset', 'books_dataset.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const books = JSON.parse(data);

    console.log(`Found ${books.length} books to insert...`);

    let insertedCount = 0;
    let skippedCount = 0;

    for (const book of books) {
      try {
        const title = book.title ? book.title.trim() : null;
        const authorName = book.author ? book.author.trim() : null;
        const genreName = book.genre ? book.genre.trim() : null;
        const publisherName = book.publisher ? book.publisher.trim() : null;
        const archiveUrl = book.archive_url ? book.archive_url.trim() : null;
        const bookUrl = book.book_url ? book.book_url.trim() : null;

        if (!title) { skippedCount++; continue; }

        // Get or create author
        let authorId = null;
        if (authorName) {
          const authorResult = await pool.query(
            'SELECT author_id FROM authors WHERE LOWER(name) = LOWER($1)',
            [authorName]
          );
          if (authorResult.rows.length === 0) {
            const newAuthor = await pool.query(
              'INSERT INTO authors (name) VALUES ($1) RETURNING author_id',
              [authorName]
            );
            authorId = newAuthor.rows[0].author_id;
          } else {
            authorId = authorResult.rows[0].author_id;
          }
        }

        // Get or create genre
        let genreId = null;
        if (genreName) {
          const genreResult = await pool.query(
            'SELECT genre_id FROM genres WHERE LOWER(name) = LOWER($1)',
            [genreName]
          );
          if (genreResult.rows.length === 0) {
            const newGenre = await pool.query(
              'INSERT INTO genres (name) VALUES ($1) RETURNING genre_id',
              [genreName]
            );
            genreId = newGenre.rows[0].genre_id;
          } else {
            genreId = genreResult.rows[0].genre_id;
          }
        }

        // Get or create publisher
        let publisherId = null;
        if (publisherName && publisherName !== 'Unknown') {
          const publisherResult = await pool.query(
            'SELECT publisher_id FROM publishers WHERE LOWER(name) = LOWER($1)',
            [publisherName]
          );
          if (publisherResult.rows.length === 0) {
            const newPublisher = await pool.query(
              'INSERT INTO publishers (name) VALUES ($1) RETURNING publisher_id',
              [publisherName]
            );
            publisherId = newPublisher.rows[0].publisher_id;
          } else {
            publisherId = publisherResult.rows[0].publisher_id;
          }
        }

        // Insert book
        const checkBook = await pool.query(
          'SELECT book_id FROM books WHERE LOWER(title) = LOWER($1) AND author_id = $2',
          [title, authorId]
        );

        if (checkBook.rows.length === 0) {
          await pool.query(
            `INSERT INTO books (title, author_id, genre_id, publisher_id, archive_url, book_url)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [title, authorId, genreId, publisherId, archiveUrl, bookUrl]
          );
          insertedCount++;
        } else {
          skippedCount++;
        }

      } catch (error) {
        console.error(`Error inserting book "${book.title}":`, error.message);
        skippedCount++;
      }
    }

    console.log(`✅ Insertion complete! Inserted: ${insertedCount}, Skipped: ${skippedCount}`);
    await pool.end();
    process.exit(0);

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run the insertion
insertBooksFromJSON();

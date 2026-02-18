import fs from "fs";

async function fetchBooks(query, limit) {
  const searchRes = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}`);
  const searchData = await searchRes.json();

  const books = await Promise.all(
    searchData.docs.map(async (work) => {
      const workUrl = `https://openlibrary.org${work.key}`;
      const archiveUrl = work.ia?.[0] ? `https://archive.org/details/${work.ia[0]}` : null;

      let genre = query.charAt(0).toUpperCase() + query.slice(1);
      let publisher = "Unknown";

      try {
        const editionsRes = await fetch(`https://openlibrary.org${work.key}/editions.json`);
        const editionsData = await editionsRes.json();
        const editions = editionsData.entries || [];

        for (const edition of editions) {
          if (edition.publishers?.length > 0) publisher = edition.publishers[0];
          if (edition.subject?.length > 0 && genre === query.charAt(0).toUpperCase() + query.slice(1)) {
            genre = edition.subject[0];
          }
          if (publisher && genre) break;
        }

        if (!genre && work.subject?.length > 0) genre = work.subject[0];
      } catch (err) {
        console.warn(`Failed to fetch editions for ${work.key}: ${err.message}`);
      }

      return {
        title: work.title || "Unknown",
        author: work.author_name?.[0] || "Unknown",
        genre,
        publisher,
        book_url: workUrl,
        archive_url: archiveUrl
      };
    })
  );

  return books;
}

// List of fiction genres
const fictions = [
  "Science Fiction","Fantasy","Historical Fiction","Mystery","Thriller","Romance",
  "Horror","Adventure","Young Adult Fiction","Classic Fiction","Literary Fiction",
  "Detective Fiction","Dystopian Fiction","Magical Realism","Western Fiction","Crime Fiction",
  "Action Fiction","Spy Fiction","Psychological Fiction","Gothic Fiction","Paranormal Fiction",
  "Urban Fiction","Satirical Fiction","Speculative Fiction","Political Fiction","Comic Fiction",
  "Romantic Comedy Fiction"
];

async function fetchAllFictions() {
  let allBooks = [];

  for (const fiction of fictions) {
    console.log(`Fetching books for genre: ${fiction}...`);
    try {
      const books = await fetchBooks(fiction, 1500);
      allBooks = allBooks.concat(books); // append to array
      console.log(`Fetched ${books.length} books for ${fiction}`);
    } catch (err) {
      console.error(`Error fetching ${fiction}:`, err.message);
    }
  }

  // Save all books at once
  fs.writeFileSync("books_dataset.json", JSON.stringify(allBooks, null, 2));
  console.log(`✅ Dataset saved with ${allBooks.length} books.`);
}

// Run the script
fetchAllFictions();

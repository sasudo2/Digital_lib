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
          // Publisher: first non-empty from publishers array
          if (edition.publishers?.length > 0) {
            publisher = edition.publishers[0];
          }

          // Genre: first subject if exists
          if (edition.subject?.length > 0 && genre === query.charAt(0).toUpperCase() + query.slice(1)) {
            genre = edition.subject[0];
          }

          if (publisher && genre) break; // stop once we have both
        }

        // Fallback for genre
        if (!genre && work.subject?.length > 0) {
          genre = work.subject[0];
        }

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



// Run and save

const fictions=["Science Fiction","Fantasy","Historical Fiction","Mystery","Thriller","Romance","Horror","Adventure","Young Adult Fiction","Classic Fiction","Literary Fiction","Dystopian Fiction","Children’s Fiction","Detective Fiction",]
for (const fiction of fictions) {
    
        fetchBooks(fiction, 1500)
          .then((books) => {
            fs.writeFileSync("books_dataset.json", JSON.stringify(books, null, 2));
            console.log("Dataset saved with genre and publisher filled properly.");
          })
          .catch(console.error);

}


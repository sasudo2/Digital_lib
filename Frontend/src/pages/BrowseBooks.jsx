import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import mainLogo from "../assets/main_logo.png";
import GenreFilter from "../components/GenreFilter";

function BrowseBooks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [favorites, setFavorites] = useState(new Set());
  const navigate = useNavigate();
  const { user } = useContext(UserDataContext);

  // Fetch all books on component mount
  useEffect(() => {
    fetchAllBooks();
    loadFavorites();
  }, []);

  const fetchAllBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/books/all`
      );
      if (response.data.success) {
        setBooks(response.data.books);
        setFilteredBooks(response.data.books);
      }
    } catch (error) {
      setAlert("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/favorites/list`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      );
      const favoriteIds = new Set(response.data.favorites?.map(b => b.book_id) || []);
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const toggleFavorite = async (e, bookId) => {
    e.stopPropagation();
    try {
      if (favorites.has(bookId)) {
        // Remove favorite
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/favorites/remove`,
          { bookId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('userToken')}`,
            },
          }
        );
        setFavorites(prev => new Set([...prev].filter(id => id !== bookId)));
      } else {
        // Add favorite
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/favorites/add`,
          { bookId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('userToken')}`,
            },
          }
        );
        setFavorites(prev => new Set([...prev, bookId]));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setAlert('Failed to update favorite');
    }
  };

  // Dynamic search filtering
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    applyFilters(query, selectedGenre, sortBy);
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId);
    applyFilters(searchQuery, genreId, sortBy);
  };

  const handleSortChange = (sortValue) => {
    setSortBy(sortValue);
    applyFilters(searchQuery, selectedGenre, sortValue);
  };

  const applyFilters = (query, genreId, sort) => {
    let filtered = [...books];

    // Filter by search query
    if (query.trim() !== "") {
      filtered = filtered.filter((book) => {
        const title = book.title?.toLowerCase() || "";
        const author = book.author_name?.toLowerCase() || "";
        const genre = book.genre_name?.toLowerCase() || "";

        return (
          title.includes(query) || 
          author.includes(query) || 
          genre.includes(query) ||
          query.split(" ").some(word => 
            title.includes(word) || 
            author.includes(word)
          )
        );
      });
    }

    // Filter by genre
    if (genreId) {
      filtered = filtered.filter((book) => book.genre_id === parseInt(genreId));
    }

    // Sort
    if (sort === "rating") {
      filtered.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
    } else if (sort === "title") {
      filtered.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    setFilteredBooks(filtered);
  };

  const handleBookClick = (book) => {
    // Navigate to book detail page with book data
    navigate(`/book/${book.book_id}`, { state: { book } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={mainLogo} alt="Pathsala Logo" className="h-12 w-12 object-contain" />
            <h1 className="text-3xl font-bold text-white">Pathsala</h1>
          </div>
          <nav className="flex gap-4 items-center">
            <button 
              onClick={() => navigate("/home")}
              className="text-white hover:text-yellow-300 font-medium transition"
            >
              Home
            </button>
            <button 
              onClick={() => navigate("/my-library")}
              className="text-white hover:text-yellow-300 font-medium transition"
            >
              My Library
            </button>
            <button className="text-white hover:text-yellow-300 font-medium transition">
              Profile
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Search and Filter Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Browse Books</h2>
          
          {/* Search Bar */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Search books by title, author, or genre..."
              value={searchQuery}
              onChange={handleSearch}
              className="flex-1 px-6 py-4 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:outline-none text-lg"
            />
            <button className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-pink-600 hover:to-orange-600 transition shadow-lg">
              Search
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <GenreFilter 
              selectedGenre={selectedGenre}
              onGenreChange={handleGenreChange}
            />
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="relevance">Relevance</option>
                <option value="rating">Highest Rated</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>
          </div>

          {searchQuery && filteredBooks.length > 0 && (
            <p className="mt-2 text-gray-600">
              Found {filteredBooks.length} book{filteredBooks.length !== 1 ? "s" : ""} matching your search
            </p>
          )}
        </div>

        {/* Alert Message */}
        {alert && (
          <div className="bg-red-500 text-white p-3 rounded mb-6 text-center">
            {alert}
          </div>
        )}

        {/* Books Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Loading books...</p>
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.book_id}
                onClick={() => handleBookClick(book)}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden cursor-pointer transform hover:scale-105 relative"
              >
                <button
                  onClick={(e) => toggleFavorite(e, book.book_id)}
                  className="absolute top-2 right-2 z-10 text-2xl transition"
                >
                  <span className={favorites.has(book.book_id) ? 'text-red-500' : 'text-gray-300'}>
                    ♥
                  </span>
                </button>
                <div className="h-64 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 flex items-center justify-center">
                  <div className="text-center p-4">
                    <h4 className="font-bold text-white text-sm line-clamp-3">{book.title}</h4>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-gray-800 mb-1 line-clamp-2">{book.title}</h4>
                  <p className="text-sm text-gray-600 mb-1">{book.author_name || "Unknown Author"}</p>
                  <p className="text-xs text-gray-500 mb-2">{book.genre_name || "Fiction"}</p>
                  {book.average_rating && (
                    <p className="text-xs text-yellow-500 mb-3">
                      ★ {book.average_rating.toFixed(1)} ({book.review_count || 0} reviews)
                    </p>
                  )}
                  <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded hover:from-indigo-600 hover:to-purple-700 transition text-sm font-semibold">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-xl text-gray-600 mb-4">
              {searchQuery || selectedGenre ? "No books found matching your search." : "No books available."}
            </p>
            {(searchQuery || selectedGenre) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedGenre("");
                  setSortBy("relevance");
                  setFilteredBooks(books);
                }}
                className="text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default BrowseBooks;

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import GenreFilter from "../components/GenreFilter";
import Avatar from "react-avatar";

function BrowseBooks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [favorites, setFavorites] = useState(new Set());
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);

  const formatTime = (minutes = 0) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setUser({ ...user, profilePic: reader.result });
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    fetchRandomBooks();
    loadFavorites();
  }, []);

  const mergeBooks = (base, extras) => {
    const byId = new Map();
    [...base, ...extras].forEach((b) => {
      if (b?.book_id && !byId.has(b.book_id)) {
        byId.set(b.book_id, b);
      }
    });
    return Array.from(byId.values());
  };

  useEffect(() => {
    const favoriteIds = new Set(favoriteBooks.map((b) => b.book_id));
    const merged = mergeBooks(books, favoriteBooks);
    setBooks(merged);
    applyFilters(searchQuery, selectedGenre, sortBy, merged, showFavoritesOnly, favoriteIds);
  }, [favoriteBooks]);

  const fetchRandomBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/books/random`, { params: { limit: 50 } });
      if (response.data.success) {
        setBooks(response.data.books);
        applyFilters(searchQuery, selectedGenre, sortBy, response.data.books, showFavoritesOnly);
      }
    } catch (error) {
      setAlert("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  const fetchPrefixSearch = async (query) => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/books/search/prefix`, {
        params: { query, limit: 50, page: 1 },
      });
      if (response.data.success) {
        setBooks(response.data.books);
        applyFilters(query, selectedGenre, sortBy, response.data.books, showFavoritesOnly);
      }
    } catch (error) {
      setAlert("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const token = localStorage.getItem("userToken") || localStorage.getItem("token");
      if (!token) return;
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/favorites/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const favoriteList = response.data.favorites || [];
      const favoriteIds = new Set(favoriteList.map((b) => b.book_id));
      setFavorites(favoriteIds);
      setFavoriteBooks(favoriteList);
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const toggleFavorite = async (e, bookId) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("userToken") || localStorage.getItem("token");
      if (!token) {
        setAlert("Login to manage favorites");
        return;
      }
      if (favorites.has(bookId)) {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/favorites/remove`, { bookId }, { headers: { Authorization: `Bearer ${token}` } });
        const nextFavorites = new Set([...favorites].filter((id) => id !== bookId));
        setFavorites(nextFavorites);
        setFavoriteBooks((prev) => prev.filter((b) => b.book_id !== bookId));
        applyFilters(searchQuery, selectedGenre, sortBy, books, showFavoritesOnly, nextFavorites);
      } else {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/favorites/add`, { bookId }, { headers: { Authorization: `Bearer ${token}` } });
        const nextFavorites = new Set([...favorites, bookId]);
        setFavorites(nextFavorites);
        setFavoriteBooks((prev) => {
          const exists = prev.some((b) => b.book_id === bookId);
          if (exists) return prev;
          const book = books.find((b) => b.book_id === bookId);
          return book ? [...prev, book] : prev;
        });
        applyFilters(searchQuery, selectedGenre, sortBy, books, showFavoritesOnly, nextFavorites);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setAlert("Failed to update favorite");
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (!query.trim()) fetchRandomBooks();
    else fetchPrefixSearch(query);
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId);
    applyFilters(searchQuery, genreId, sortBy);
  };

  const handleSortChange = (sortValue) => {
    setSortBy(sortValue);
    applyFilters(searchQuery, selectedGenre, sortValue);
  };

  // Updated applyFilters for search + genre
  const applyFilters = (query, genreId, sort, baseList = books, favoritesOnly = showFavoritesOnly, favoritesSet = favorites) => {
    let filtered = [...baseList];

    if (favoritesOnly) filtered = filtered.filter((book) => favoritesSet.has(book.book_id));

    if (query.trim()) {
      filtered = filtered.filter((book) => {
        const title = book.title?.toLowerCase() || "";
        const author = book.author_name?.toLowerCase() || "";
        const genre = book.genre_name?.toLowerCase() || "";
        return (
          title.includes(query) ||
          author.includes(query) ||
          genre.includes(query) ||
          query.split(" ").some((word) => title.includes(word) || author.includes(word) || genre.includes(word))
        );
      });
    }

    if (genreId) filtered = filtered.filter((book) => book.genre_id === parseInt(genreId));

    if (sort === "rating") filtered.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
    else if (sort === "title") filtered.sort((a, b) => (a.title || "").localeCompare(b.title || ""));

    setFilteredBooks(filtered);
  };

  const handleBookClick = (book) => navigate(`/book/${book.book_id}`, { state: { book } });

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SiteHeader showProfileButton onProfileClick={() => setShowProfile(true)} />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Browse Books</h2>

          <div className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Search books by title, author, or genre..."
              value={searchQuery}
              onChange={handleSearch}
              className="flex-1 px-6 py-4 rounded-lg border-2 border-gray-300 focus:border-black focus:outline-none text-lg"
            />
            <button className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition shadow-lg">Search</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <GenreFilter selectedGenre={selectedGenre} onGenreChange={handleGenreChange} />

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
              >
                <option value="relevance">Relevance</option>
                <option value="rating">Highest Rated</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-semibold text-gray-800 mb-2 opacity-0 select-none">Favorites</label>
              <button
                onClick={() => {
                  setShowFavoritesOnly((prev) => {
                    const next = !prev;
                    applyFilters(searchQuery, selectedGenre, sortBy, books, next);
                    return next;
                  });
                }}
                className={`w-full px-4 py-2 rounded-lg border font-semibold transition ${
                  showFavoritesOnly ? "bg-black text-white border-black" : "bg-white text-gray-800 border-gray-400 hover:bg-gray-100"
                }`}
              >
                {showFavoritesOnly ? "Showing Favorites" : "Show Favorites"}
              </button>
            </div>
          </div>

          {searchQuery && filteredBooks.length > 0 && (
            <p className="mt-2 text-gray-600">
              Found {filteredBooks.length} book{filteredBooks.length !== 1 ? "s" : ""} matching your search
            </p>
          )}
        </div>

        {alert && <div className="bg-black text-white p-3 rounded mb-6 text-center">{alert}</div>}

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
                className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition overflow-hidden cursor-pointer transform hover:scale-105 relative"
              >
                <button
                  onClick={(e) => toggleFavorite(e, book.book_id)}
                  className="absolute top-2 right-2 z-10 text-2xl transition"
                >
                  <span className={favorites.has(book.book_id) ? "text-gray-900" : "text-gray-400"}>♥</span>
                </button>
                <div className="h-64 bg-gradient-to-br from-gray-900 via-gray-700 to-gray-600 flex items-center justify-center">
                  <div className="text-center p-4">
                    <h4 className="font-bold text-white text-sm line-clamp-3">{book.title}</h4>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-gray-900 mb-1 line-clamp-2">{book.title}</h4>
                  <p className="text-sm text-gray-700 mb-1">{book.author_name || "Unknown Author"}</p>
                  <p className="text-xs text-gray-500 mb-2">{book.genre_name || "Fiction"}</p>
                  {book.average_rating && (
                    <p className="text-xs text-gray-700 mb-3">
                      ★ {book.average_rating.toFixed(1)} ({book.review_count || 0} reviews)
                    </p>
                  )}
                  <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition text-sm font-semibold">View Details</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-xl text-gray-700 mb-4">
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
                className="text-gray-900 hover:text-gray-700 font-semibold"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </main>

      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowProfile(false)} />
          <div className="relative bg-white rounded-lg shadow-xl w-11/12 max-w-md p-6 z-10">
            <h3 className="text-xl font-bold mb-4">Your Profile</h3>
            <div className="flex gap-4 items-center mb-4">
              <div className="h-20 w-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                {user?.profilePic ? (
                  <img src={user.profilePic} alt="profile" className="h-full w-full object-cover" />
                ) : (
                  <Avatar
                    name={
                      user?.fullname?.firstname || user?.fullname?.lastname
                        ? `${user.fullname.firstname || ""} ${user.fullname.lastname || ""}`.trim()
                        : "User"
                    }
                    size="80"
                    round
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{user?.fullname?.firstname} {user?.fullname?.lastname}</p>
                <p className="text-sm text-gray-600">{user?.email || "No email set"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-xs text-gray-500">Read Books</div>
                <div className="font-semibold">{user?.readBooks?.length || 0}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-xs text-gray-500">Time Spent</div>
                <div className="font-semibold">{formatTime(user?.timeSpentMinutes)}</div>
              </div>
              <div className="col-span-2 p-3 bg-gray-50 rounded">
                <div className="text-xs text-gray-500">Account Created</div>
                <div className="font-semibold">{user?.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}</div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-2">Profile Photo</label>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="text-sm" />
            </div>

            <div className="flex justify-between gap-2">
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("pathsala_user");
                  navigate("/");
                }}
                className="px-4 py-2 rounded bg-black text-white font-semibold hover:bg-gray-800 transition"
              >
                Logout
              </button>
              <button onClick={() => setShowProfile(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}

export default BrowseBooks;
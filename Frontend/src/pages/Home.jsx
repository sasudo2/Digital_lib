import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { UserDataContext } from "../context/UserContext";
import Avatar from "react-avatar";

function Home() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);
  const [showProfile, setShowProfile] = useState(false);
  const [popularBooks, setPopularBooks] = useState([]);
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  console.log("User data in Home:", user);

  // Refresh user data from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("pathsala_user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log("Loaded user from localStorage:", userData);
        setUser(userData);
      } catch (e) {
        console.error("Error parsing stored user:", e);
      }
    }
    
    // Fetch popular books
    fetchPopularBooks();
    // Fetch favorite books
    fetchFavoriteBooks();
  }, []);

  const formatTime = (minutes = 0) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  const fetchPrefixSearch = async (query) => {
    try {
      setLoadingSearch(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/books/search/prefix`,
        { params: { query, limit: 50, page: 1 } }
      );
      if (response.data.success) {
        setSearchResults(response.data.books || []);
      }
    } catch (error) {
      console.error('Error searching books:', error);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }
    fetchPrefixSearch(query);
  };

  const fetchPopularBooks = async () => {
    try {
      setLoadingPopular(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/books/popular`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken') || localStorage.getItem('token')}`,
          },
        }
      );
      setPopularBooks(response.data.books || []);
    } catch (error) {
      console.error('Error fetching popular books:', error);
    } finally {
      setLoadingPopular(false);
    }
  };

  const fetchFavoriteBooks = async () => {
    try {
      setLoadingFavorites(true);
      const token = localStorage.getItem('userToken') || localStorage.getItem('token');
      if (!token) {
        setFavoriteBooks([]);
        return;
      }
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/favorites/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFavoriteBooks(response.data.favorites || []);
    } catch (error) {
      console.error('Error fetching favorite books:', error);
    } finally {
      setLoadingFavorites(false);
    }
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

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader showProfileButton onProfileClick={() => setShowProfile(true)} />

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-black mb-4">
            Welcome to Pathsala
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto font-medium">
            Your digital gateway to endless knowledge. Discover, borrow, and
            manage books with ease.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search for books, authors, or categories..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="flex-1 px-6 py-4 rounded-lg border-2 border-gray-400 focus:border-black focus:outline-none text-lg"
            />
            <button
              onClick={() => {
                if (searchQuery.trim() === "") {
                  setSearchResults([]);
                  return;
                }
                fetchPrefixSearch(searchQuery);
              }}
              className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Search
            </button>
          </div>
        </div>

        {/* Search Results / Random Picks */}
        {searchQuery.trim() !== "" && (
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-black mb-6">
              Search Results
            </h3>
            {loadingSearch ? (
              <p className="text-gray-600">Loading books...</p>
            ) : searchResults.length > 0 ? (
              <div className="grid md:grid-cols-4 gap-6">
                {searchResults.slice(0, 8).map((book) => (
                  <div
                    key={book.book_id}
                    onClick={() => navigate(`/book/${book.book_id}`, { state: { book } })}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden cursor-pointer transform hover:scale-105"
                  >
                    <div className="h-64 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 flex items-center justify-center">
                      <h4 className="font-bold text-white text-sm line-clamp-3 p-4">{book.title}</h4>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-gray-800 mb-1 line-clamp-2">{book.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{book.author_name || "Unknown Author"}</p>
                      <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition text-sm font-semibold">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No books found.</p>
            )}
          </div>
        )}

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-100 p-8 rounded-xl shadow-lg hover:shadow-2xl transition hover:scale-105 border-2 border-gray-300">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-black mb-2">
              Vast Collection
            </h3>
            <p className="text-gray-700">
              Access thousands of books across various genres and categories.
            </p>
          </div>

          <div className="bg-gray-100 p-8 rounded-xl shadow-lg hover:shadow-2xl transition hover:scale-105 border-2 border-gray-300">
            <div className="text-4xl mb-4">🔖</div>
            <h3 className="text-xl font-bold text-black mb-2">
              Easy Management
            </h3>
            <p className="text-gray-700">
              Borrow, return, and track your reading history effortlessly.
            </p>
          </div>

          <div className="bg-gray-100 p-8 rounded-xl shadow-lg hover:shadow-2xl transition hover:scale-105 border-2 border-gray-300">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-bold text-black mb-2">
              Personalized
            </h3>
            <p className="text-gray-700">
              Get recommendations based on your reading preferences.
            </p>
          </div>
        </div>

        {/* Popular Books Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-black mb-6">
            Popular Books
          </h3>
          {loadingPopular ? (
            <p className="text-gray-600">Loading popular books...</p>
          ) : popularBooks.length > 0 ? (
            <div className="grid md:grid-cols-4 gap-6">
              {popularBooks.slice(0, 4).map((book) => (
                <div
                  key={book.book_id}
                  onClick={() => navigate(`/book/${book.book_id}`, { state: { book } })}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden cursor-pointer transform hover:scale-105"
                >
                  <div className="h-64 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 flex items-center justify-center">
                    <h4 className="font-bold text-white text-sm line-clamp-3 p-4">{book.title}</h4>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-800 mb-1 line-clamp-2">{book.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{book.author_name || "Unknown Author"}</p>
                    {book.average_rating && (
                      <p className="text-xs text-gray-700 mb-3">
                        ★ {book.average_rating.toFixed(1)} ({book.review_count || 0})
                      </p>
                    )}
                    <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition text-sm font-semibold">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No popular books available yet.</p>
          )}
        </div>

        {/* Personalized Section - Favorite Books */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-black mb-6">
            Your Favorites
          </h3>
          {loadingFavorites ? (
            <p className="text-gray-600">Loading your favorite books...</p>
          ) : favoriteBooks.length > 0 ? (
            <div className="grid md:grid-cols-4 gap-6">
              {favoriteBooks.slice(0, 4).map((book) => (
                <div
                  key={book.book_id}
                  onClick={() => navigate(`/book/${book.book_id}`, { state: { book } })}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden cursor-pointer transform hover:scale-105"
                >
                  <div className="h-64 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 flex items-center justify-center">
                    <h4 className="font-bold text-white text-sm line-clamp-3 p-4">{book.title}</h4>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-800 mb-1 line-clamp-2">{book.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{book.author_name || "Unknown Author"}</p>
                    {book.average_rating && (
                      <p className="text-xs text-gray-700 mb-3">
                        ♥ Added to favorites
                      </p>
                    )}
                    <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition text-sm font-semibold">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600 mb-4">You haven't marked any favorites yet.</p>
              <button
                onClick={() => navigate("/browse")}
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Browse Books
              </button>
            </div>
          )}
        </div>

      </main>

      {/* Footer */}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowProfile(false)} />
          <div className="relative bg-white rounded-lg shadow-xl w-11/12 max-w-md p-6 z-10">
            <h3 className="text-xl font-bold mb-4">Your Profile</h3>
            <div className="flex gap-4 items-center mb-4">
              <div className="h-20 w-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                {user && user.profilePic ? (
                  <img src={user.profilePic} alt="profile" className="h-full w-full object-cover" />
                ) : (
                  <Avatar 
                    name={
                      user && user.fullname && (user.fullname.firstname || user.fullname.lastname)
                        ? `${user.fullname.firstname || ''} ${user.fullname.lastname || ''}`.trim()
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
                <div className="font-semibold">{(user?.readBooks && user.readBooks.length) || 0}</div>
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
              <button onClick={() => setShowProfile(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition">Close</button>
            </div>
          </div>
        </div>
      )}
      <SiteFooter />
    </div>
  );
}

export default Home;

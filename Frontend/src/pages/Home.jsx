import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import mainLogo from "../assets/main_logo.png";
import { UserDataContext } from "../context/UserContext";
import Avatar from "react-avatar";

function Home() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);
  const [showProfile, setShowProfile] = useState(false);
  const [popularBooks, setPopularBooks] = useState([]);
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [borrowingHistory, setBorrowingHistory] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [loadingBorrowing, setLoadingBorrowing] = useState(true);

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
    // Fetch borrowing history
    fetchBorrowingHistory();
  }, []);

  const formatTime = (minutes = 0) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  const fetchPopularBooks = async () => {
    try {
      setLoadingPopular(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/books/popular`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
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
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/favorites/list`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
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

  const fetchBorrowingHistory = async () => {
    try {
      setLoadingBorrowing(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/borrowing/history`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      );
      setBorrowingHistory(response.data.history || []);
    } catch (error) {
      console.error('Error fetching borrowing history:', error);
    } finally {
      setLoadingBorrowing(false);
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
              onClick={() => navigate("/browse")}
              className="text-white hover:text-yellow-300 font-medium transition"
            >
              Browse Books
            </button>
            <button 
              onClick={() => navigate("/my-library")}
              className="text-white hover:text-yellow-300 font-medium transition"
            >
              My Library
            </button>

            <button
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition"
              aria-label="Open profile"
            >
              {user && user.profilePic ? (
                <img src={user.profilePic} alt="avatar" className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <Avatar 
                  name={
                    user && user.fullname && (user.fullname.firstname || user.fullname.lastname)
                      ? `${user.fullname.firstname || ''} ${user.fullname.lastname || ''}`.trim()
                      : "User"
                  } 
                  size="32" 
                  round 
                />
              )}
              <span className="text-white hidden sm:inline">Profile</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
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
              className="flex-1 px-6 py-4 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:outline-none text-lg"
            />
            <button className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-pink-600 hover:to-orange-600 transition shadow-lg">
              Search
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-8 rounded-xl shadow-lg hover:shadow-2xl transition hover:scale-105 border-2 border-blue-300">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-blue-800 mb-2">
              Vast Collection
            </h3>
            <p className="text-blue-700">
              Access thousands of books across various genres and categories.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-8 rounded-xl shadow-lg hover:shadow-2xl transition hover:scale-105 border-2 border-purple-300">
            <div className="text-4xl mb-4">🔖</div>
            <h3 className="text-xl font-bold text-purple-800 mb-2">
              Easy Management
            </h3>
            <p className="text-purple-700">
              Borrow, return, and track your reading history effortlessly.
            </p>
          </div>

          <div className="bg-gradient-to-br from-pink-100 to-pink-200 p-8 rounded-xl shadow-lg hover:shadow-2xl transition hover:scale-105 border-2 border-pink-300">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-bold text-pink-800 mb-2">
              Personalized
            </h3>
            <p className="text-pink-700">
              Get recommendations based on your reading preferences.
            </p>
          </div>
        </div>

        {/* Popular Books Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
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
                  <div className="h-64 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 flex items-center justify-center">
                    <h4 className="font-bold text-white text-sm line-clamp-3 p-4">{book.title}</h4>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-800 mb-1 line-clamp-2">{book.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{book.author_name || "Unknown Author"}</p>
                    {book.average_rating && (
                      <p className="text-xs text-yellow-500 mb-3">
                        ★ {book.average_rating.toFixed(1)} ({book.review_count || 0})
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
            <p className="text-gray-600">No popular books available yet.</p>
          )}
        </div>

        {/* Personalized Section - Favorite Books */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent mb-6">
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
                  <div className="h-64 bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 flex items-center justify-center">
                    <h4 className="font-bold text-white text-sm line-clamp-3 p-4">{book.title}</h4>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-800 mb-1 line-clamp-2">{book.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{book.author_name || "Unknown Author"}</p>
                    {book.average_rating && (
                      <p className="text-xs text-yellow-500 mb-3">
                        ♥ Added to favorites
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
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600 mb-4">You haven't marked any favorites yet.</p>
              <button
                onClick={() => navigate("/browse")}
                className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-2 rounded-lg hover:from-pink-600 hover:to-orange-600 transition"
              >
                Browse Books
              </button>
            </div>
          )}
        </div>

        {/* Easy Management Section - Borrowing History */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-6">
            Borrowing History
          </h3>
          {loadingBorrowing ? (
            <p className="text-gray-600">Loading your borrowing history...</p>
          ) : borrowingHistory.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
                    <tr>
                      <th className="px-6 py-3 text-left">Book Title</th>
                      <th className="px-6 py-3 text-left">Author</th>
                      <th className="px-6 py-3 text-left">Borrow Date</th>
                      <th className="px-6 py-3 text-left">Return Date</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-left">Librarian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {borrowingHistory.slice(0, 5).map((entry) => (
                      <tr key={entry.borrow_id} className="hover:bg-gray-50">
                        <td className="px-6 py-3">{entry.title}</td>
                        <td className="px-6 py-3 text-sm text-gray-600">{entry.author_name}</td>
                        <td className="px-6 py-3 text-sm">
                          {new Date(entry.borrow_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-3 text-sm">
                          {entry.return_date ? new Date(entry.return_date).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            entry.status === 'active' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {entry.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600">
                          {entry.librarian_name || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">No borrowing history yet.</p>
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
                className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition"
              >
                Logout
              </button>
              <button onClick={() => setShowProfile(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition">Close</button>
            </div>
          </div>
        </div>
      )}
      <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-indigo-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* About Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={mainLogo} alt="Pathsala Logo" className="h-10 w-10 object-contain" />
                <h3 className="text-2xl font-bold text-yellow-300">Pathsala</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Your trusted online library management system for discovering and managing your favorite books.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-yellow-300">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-yellow-300 transition text-sm">
                    Browse Books
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-yellow-300 transition text-sm">
                    Categories
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-yellow-300 transition text-sm">
                    New Arrivals
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-yellow-300 transition text-sm">
                    About Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-yellow-300">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-yellow-300 transition text-sm">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-yellow-300 transition text-sm">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-yellow-300 transition text-sm">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-yellow-300 transition text-sm">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-yellow-300">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-yellow-300">📧</span>
                  <a href="mailto:info@pathsala.com" className="text-gray-300 hover:text-yellow-300 transition">
                    info@pathsala.com
                  </a>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-yellow-300">📞</span>
                  <a href="tel:+1234567890" className="text-gray-300 hover:text-yellow-300 transition">
                    +1 (234) 567-890
                  </a>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-yellow-300">📍</span>
                  <span className="text-gray-300">123 Library St, Book City</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Media & Copyright */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                &copy; 2026 Pathsala. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-gray-300 hover:text-yellow-300 transition text-2xl">
                  📘
                </a>
                <a href="#" className="text-gray-300 hover:text-yellow-300 transition text-2xl">
                  🐦
                </a>
                <a href="#" className="text-gray-300 hover:text-yellow-300 transition text-2xl">
                  📸
                </a>
                <a href="#" className="text-gray-300 hover:text-yellow-300 transition text-2xl">
                  💼
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import mainLogo from "../assets/main_logo.png";

function MyLibrary() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);
  const [readBooks, setReadBooks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState("");

  useEffect(() => {
    fetchLibraryData();
  }, []);

  const fetchLibraryData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Fetch reading stats
      const statsResponse = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/reading/stats`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (statsResponse.data.success) {
        setStats(statsResponse.data.stats);
        setReadBooks(statsResponse.data.readBooks || []);
      }
    } catch (error) {
      console.error("Error fetching library data:", error);
      setAlert("Failed to load your library");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleRefresh = () => {
    fetchLibraryData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/home")}
          >
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
              onClick={() => navigate("/home")}
              className="text-white hover:text-yellow-300 font-medium transition"
            >
              Home
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Alert */}
        {alert && (
          <div className="bg-red-500 text-white p-4 rounded mb-6 text-center">
            {alert}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Loading your library...</p>
          </div>
        ) : (
          <>
            {/* Reading Stats */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Reading Statistics</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-8 rounded-xl shadow-lg border-2 border-blue-300">
                  <div className="text-5xl font-bold text-blue-600 mb-2">{readBooks.length}</div>
                  <div className="text-lg text-blue-800 font-semibold">Books Read</div>
                  <p className="text-sm text-blue-700 mt-1">Total books finished</p>
                </div>

                <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-8 rounded-xl shadow-lg border-2 border-purple-300">
                  <div className="text-5xl font-bold text-purple-600 mb-2">{formatTime(stats?.time_spent_minutes || 0)}</div>
                  <div className="text-lg text-purple-800 font-semibold">Time Spent</div>
                  <p className="text-sm text-purple-700 mt-1">Total reading time</p>
                </div>

                <div className="bg-gradient-to-br from-pink-100 to-pink-200 p-8 rounded-xl shadow-lg border-2 border-pink-300">
                  <div className="text-5xl font-bold text-pink-600 mb-2">
                    {Math.round((stats?.time_spent_minutes || 0) / readBooks.length) || 0}
                  </div>
                  <div className="text-lg text-pink-800 font-semibold">Avg Time/Book</div>
                  <p className="text-sm text-pink-700 mt-1">Average reading time per book</p>
                </div>
              </div>
            </div>

            {/* Books Read Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Books You've Read</h2>
                <button
                  onClick={handleRefresh}
                  className="bg-indigo-600 text-white px-4 py-2 rounded font-semibold hover:bg-indigo-700 transition"
                >
                  🔄 Refresh
                </button>
              </div>

              {readBooks.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {readBooks.map((book) => (
                    <div
                      key={book.book_id}
                      className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"
                    >
                      <div className="h-48 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 flex items-center justify-center p-4">
                        <div className="text-center">
                          <p className="text-white font-bold text-sm line-clamp-3">{book.title}</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-gray-800 mb-1 line-clamp-2">{book.title}</h4>
                        <p className="text-sm text-gray-600 mb-1">{book.author_name || "Unknown Author"}</p>
                        <p className="text-xs text-gray-500 mb-3">{book.genre_name || "Fiction"}</p>
                        <button
                          onClick={() => navigate(`/book/${book.book_id}`, { state: { book } })}
                          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded hover:from-indigo-600 hover:to-purple-700 transition text-sm font-semibold"
                        >
                          Read Again
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-xl text-gray-600 mb-6">
                    📚 You haven't read any books yet!
                  </p>
                  <button
                    onClick={() => navigate("/browse")}
                    className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-orange-600 transition"
                  >
                    Start Reading Now
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default MyLibrary;

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import Avatar from "react-avatar";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

function MyLibrary() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);
  const [readBooks, setReadBooks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState("");
  const [showProfile, setShowProfile] = useState(false);

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
    <div className="min-h-screen bg-white text-gray-900">
      <SiteHeader showProfileButton onProfileClick={() => setShowProfile(true)} />

      <main className="container mx-auto px-4 py-12">
        {/* Alert */}
        {alert && (
          <div className="bg-black text-white p-4 rounded mb-6 text-center">
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
                <div className="bg-gray-100 p-8 rounded-xl shadow-lg border-2 border-gray-300">
                  <div className="text-5xl font-bold text-gray-900 mb-2">{readBooks.length}</div>
                  <div className="text-lg text-gray-900 font-semibold">Books Read</div>
                  <p className="text-sm text-gray-700 mt-1">Total books finished</p>
                </div>

                <div className="bg-gray-100 p-8 rounded-xl shadow-lg border-2 border-gray-300">
                  <div className="text-5xl font-bold text-gray-900 mb-2">{formatTime(stats?.time_spent_minutes || 0)}</div>
                  <div className="text-lg text-gray-900 font-semibold">Time Spent</div>
                  <p className="text-sm text-gray-700 mt-1">Total reading time</p>
                </div>

                <div className="bg-gray-100 p-8 rounded-xl shadow-lg border-2 border-gray-300">
                  <div className="text-5xl font-bold text-gray-900 mb-2">
                    {Math.round((stats?.time_spent_minutes || 0) / readBooks.length) || 0}
                  </div>
                  <div className="text-lg text-gray-900 font-semibold">Avg Time/Book</div>
                  <p className="text-sm text-gray-700 mt-1">Average reading time per book</p>
                </div>
              </div>
            </div>

            {/* Books Read Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Books You've Read</h2>
                <button
                  onClick={handleRefresh}
                  className="bg-black text-white px-4 py-2 rounded font-semibold hover:bg-gray-800 transition"
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
                      <div className="h-48 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 flex items-center justify-center p-4">
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
                          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition text-sm font-semibold"
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
                    className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
                  >
                    Start Reading Now
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </main>

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

export default MyLibrary;

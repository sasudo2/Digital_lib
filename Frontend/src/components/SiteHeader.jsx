import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";
import { UserDataContext } from "../context/UserContext";
import mainLogo from "../assets/main_logo.png";

function SiteHeader({ showProfileButton = false, onProfileClick }) {
  const { user } = useContext(UserDataContext);

  return (
    <header className="bg-black shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/home" className="flex items-center gap-3">
          <img src={mainLogo} alt="Pathsala Logo" className="h-12 w-12 object-contain" />
          <h1 className="text-3xl font-bold text-white">Pathsala</h1>
        </Link>
        <nav className="flex gap-4 items-center">
          <Link
            to="/browse"
            className="text-white hover:text-gray-300 font-medium transition"
          >
            Browse Books
          </Link>
          <Link
            to="/my-library"
            className="text-white hover:text-gray-300 font-medium transition"
          >
            My Library
          </Link>

          {showProfileButton && (
            <button
              onClick={onProfileClick}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition"
              aria-label="Open profile"
              type="button"
            >
              {user && user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="avatar"
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <Avatar
                  name={
                    user && user.fullname && (user.fullname.firstname || user.fullname.lastname)
                      ? `${user.fullname.firstname || ""} ${user.fullname.lastname || ""}`.trim()
                      : "User"
                  }
                  size="32"
                  round
                />
              )}
              <span className="text-white hidden sm:inline">Profile</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default SiteHeader;

import React from "react";
import mainLogo from "../assets/main_logo.png";

function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={mainLogo} alt="Pathsala Logo" className="h-12 w-12 object-contain" />
            <h1 className="text-3xl font-bold text-white">Pathsala</h1>
          </div>
          <nav className="flex gap-6">
            <button className="text-white hover:text-gray-300 font-medium transition">
              Browse Books
            </button>
            <button className="text-white hover:text-gray-300 font-medium transition">
              My Library
            </button>
            <button className="text-white hover:text-gray-300 font-medium transition">
              Profile
            </button>
          </nav>
        </div>
      </header>

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
              className="flex-1 px-6 py-4 rounded-lg border-2 border-gray-400 focus:border-black focus:outline-none text-lg"
            />
            <button className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition">
              Search
            </button>
          </div>
        </div>

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
        <div>
          <h3 className="text-3xl font-bold text-black mb-6">
            Popular Books
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden cursor-pointer border-2 border-gray-300"
              >
                <div className="h-64 bg-gray-400"></div>
                <div className="p-4">
                  <h4 className="font-bold text-gray-800 mb-1">Book Title</h4>
                  <p className="text-sm text-gray-600 mb-2">Author Name</p>
                  <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* About Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={mainLogo} alt="Pathsala Logo" className="h-10 w-10 object-contain" />
                <h3 className="text-2xl font-bold text-white">Pathsala</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Your trusted online library management system for discovering and managing your favorite books.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition text-sm">
                    Browse Books
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition text-sm">
                    Categories
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition text-sm">
                    New Arrivals
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition text-sm">
                    About Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition text-sm">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition text-sm">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition text-sm">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition text-sm">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-white">📧</span>
                  <a href="mailto:info@pathsala.com" className="text-gray-300 hover:text-white transition">
                    info@pathsala.com
                  </a>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-white">📞</span>
                  <a href="tel:+1234567890" className="text-gray-300 hover:text-white transition">
                    +1 (234) 567-890
                  </a>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-white">📍</span>
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
                <a href="#" className="text-gray-300 hover:text-white transition text-2xl">
                  📘
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition text-2xl">
                  🐦
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition text-2xl">
                  📸
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition text-2xl">
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

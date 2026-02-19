import React from "react";
import mainLogo from "../assets/main_logo.png";

function SiteFooter() {
  return (
    <footer className="bg-black text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={mainLogo} alt="Pathsala Logo" className="h-10 w-10 object-contain" />
              <h3 className="text-2xl font-bold text-white">Pathsala</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Your trusted online library management system for discovering and managing your favorite books.
            </p>
          </div>

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
  );
}

export default SiteFooter;

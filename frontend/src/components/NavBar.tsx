import React from "react";
import { Link } from "react-router-dom";

export default function NavBar() {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  return (
    <div>
      <nav className="bg-gradient-to-r from-gray-700 to-gray-900 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="text-3xl font-bold text-white">
              StayFinder
            </Link>

            <div className="flex space-x-6 items-center">
              <Link
                to="/"
                className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                Home
              </Link>

              {token && !isAdmin && (
                <Link
                  to="/my-bookings"
                  className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
                >
                  My Bookings
                </Link>
              )}

              {token && isAdmin && (
                <Link
                  to="/admin"
                  className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
                >
                  Admin Panel
                </Link>
              )}

              {token ? (
                <Link
                  to="/auth"
                  className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium transition duration-200"
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("isAdmin");
                  }}
                >
                  Sign Out
                </Link>
              ) : (
                <Link
                  to="/auth"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition duration-200"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
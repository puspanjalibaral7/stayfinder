import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About StayFinder</h3>
            <p className="text-sm text-gray-400">
              StayFinder is your trusted platform for booking hotels and accommodations. We aim to provide the best deals and a seamless booking experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition duration-200"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition duration-200"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-sm text-gray-400">Email: support@stayfinder.com</p>
            <p className="text-sm text-gray-400">Phone: +9779800000000</p>
            <p className="text-sm text-gray-400">Address: Masbar-7, Pokhara</p>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} StayFinder. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
"use client";
import "@styles/globals.css";
import Link from "next/link";
import { auth } from "@firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState } from "react";
import { sendEmailVerification } from "firebase/auth";
import Image from "next/image";

const RootLayout = ({ children }) => {
  const [user] = useAuthState(auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <html lang="en">
      <body className="bg-gray-900">
        {/* Top Navigation Bar */}
        <nav className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
          {/* Site Name */}
          <Link href="/">
            <button className="text-2xl font-bold text-white">Amygos</button>
          </Link>

          <h1>Amy live tracker (coming soon)</h1>
          {/* Search Bar */}
          <div className="w-1/3 mr-60">
            <input
              type="text"
              placeholder="Search..."
              className="p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          {/* Right Side of Top Nav */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                {/* Create Post Button */}
                <Link href="/createpost">
                  <button className="bg-pink-300 p-3 rounded-lg text-white font-semibold">
                    Create Post
                  </button>
                </Link>

                {/* Logout Button */}
                <Link href="/signout">
                  <button className="bg-purple-600 p-3 rounded-lg text-white font-semibold">
                    Logout
                  </button>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <div
                    className="cursor-pointer text-white"
                    onClick={toggleDropdown}
                  >
                    <Image
                      src="/images/user.png"
                      alt="Thumbs Up"
                      width={40}
                      height={40}
                    />
                  </div>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
                      <Link href="/yourposts">
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          View Your Posts
                        </button>
                      </Link>
                      <Link href="/settings">
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Settings
                        </button>
                      </Link>
                      <Link href="/signout">
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Logout
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Sign In/Sign Up for non-logged-in users */}
            {!user && (
              <>
                <Link href="/signin">
                  <button className="bg-green-600 p-3 rounded-lg text-white font-semibold">
                    Sign In
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="bg-green-600 p-3 rounded-lg text-white font-semibold">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Left Side Navigation Bar */}
        <div className="flex flex-row justify-center">
          <nav className="bg-gradient-to-b from-gray-800 to-gray-900 w-64 min-h-screen p-6 fixed top-0 left-0 z-40 pt-16">
            <ul className="mt-12">
              <li>
                <Link href="/">
                  <button className="text-white text-lg font-semibold hover:bg-gray-700 p-3 rounded w-full text-left">
                    Home
                  </button>
                </Link>
              </li>
              {user && (
                <>
                  <li>
                    <Link href="/yourposts">
                      <button className="text-white text-lg font-semibold hover:bg-gray-700 p-3 rounded w-full text-left">
                        Your Posts
                      </button>
                    </Link>
                  </li>
                  <li>
                    <Link href="/settings">
                      <button className="text-white text-lg font-semibold hover:bg-gray-700 p-3 rounded w-full text-left">
                        Settings
                      </button>
                    </Link>
                  </li>
                </>
              )}

              <li>
                <button className="text-white text-lg font-semibold hover:bg-gray-700 p-3 rounded w-full text-left">
                  Visit Merch Store
                </button>
              </li>
              <li>
                <Link href="https://discord.gg/VrsNkMTr">
                  <button className="text-white text-lg font-semibold hover:bg-gray-700 p-3 rounded w-full text-left">
                    Join The Discord
                  </button>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Main Content */}
          <main className="justify-items-center ml-20">{children}</main>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;

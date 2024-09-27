import "@styles/globals.css";
import Link from "next/link";

export const metadata = {
  title: "AmygosMedia",
  description: "Share Whatever You Want With The Amygos Squad",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className="bg-gray-900">
        <nav className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
          <Link href="/">
            <button className="text-2xl font-bold text-white">
              Amygos Media
            </button>
          </Link>
          <div className="w-1/3">
            <input
              type="text"
              placeholder="Search..."
              className="p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-white">Profile Icon</div>
          </div>
        </nav>

        <div class="flex flex-row justify-center">
          <nav className="bg-gradient-to-b from-gray-800 to-gray-900 w-64 min-h-screen p-6 fixed top-0 left-0 z-40 pt-16">
            <ul className="mt-12">
              <li>
                <Link href="/">
                  <button class="text-white text-lg font-semibold hover:bg-gray-700 p-3 rounded w-full text-left">
                    Home
                  </button>
                </Link>
              </li>
              <li>
                <Link href="/settings">
                  <button class="text-white text-lg font-semibold hover:bg-gray-700 p-3 rounded w-full text-left">
                    Settings
                  </button>
                </Link>
              </li>
            </ul>
          </nav>
          <main class="justify-items-center ml-20">{children}</main>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;

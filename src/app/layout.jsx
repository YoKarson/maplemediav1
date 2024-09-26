import "@styles/globals.css";
import Link from "next/link";

export const metadata = {
  title: "MapleMedia",
  description: "Share Your Accomplishments with The World",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <nav className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
          <div className="text-2xl font-bold text-white">Maple Media</div>
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
          {/* Side Nav Bar */}
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

          <div class="">
            {/* Main Content Area */}
            <main class="ml-20 mt-20">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;

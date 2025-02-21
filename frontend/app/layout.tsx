import "./globals.css";
import { Inter } from "next/font/google";

// Load the Inter font from Google
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Task Manager",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
        {/* Navbar */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Task Manager</h1>
            <div>
              <a href="/login" className="mr-4 hover:underline">
                Login
              </a>
              <a href="/register" className="hover:underline">
                Register
              </a>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="container mx-auto px-4 py-8 flex-grow">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Task Manager. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}

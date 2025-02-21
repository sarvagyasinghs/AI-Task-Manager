// frontend/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to Task Manager</h1>
      <div className="flex space-x-4">
        <Link href="/login" className="px-4 py-2 bg-blue-500 text-white rounded">
          Login
        </Link>
        <Link href="/register" className="px-4 py-2 bg-green-500 text-white rounded">
          Register
        </Link>
      </div>
    </div>
  );
}

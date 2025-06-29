'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: "url('/home.jpg')",
      }}
    >
      <div className="bg-white bg-opacity-80 p-10 rounded-xl shadow-xl text-center max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to FinTrack</h1>
        <p className="text-gray-600 mb-6">Take control of your finances — manage your budget, track your income and expenses, build savings, and plan smarter for a better future. 💸📈</p>
        <Link
          href="/signup"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}


"use client";

import Link from "next/link";

export default function MiniGamePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="max-w-3xl text-center">
        <p className="text-cyan-400">Coming Soon</p>
        <h1 className="mt-4 text-5xl font-bold">Mini Game</h1>
        <p className="mt-6 text-gray-400">
          A small interactive cyber portfolio game will be added here.
        </p>

        <Link
          href="/"
          className="mt-10 inline-block rounded-2xl border border-cyan-400 px-6 py-3 text-cyan-400 hover:bg-cyan-400 hover:text-black"
        >
          Back to Portfolio
        </Link>
      </div>
    </main>
  );
}
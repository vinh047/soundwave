"use client";
import Link from "next/link";
import { Button } from "../ui/Button";
import { Music } from "lucide-react";

export default function HomeHeader({ handleAuth }: { handleAuth: () => void }) {
  return (
    <header className="absolute left-0 top-0 z-50 flex w-full items-center justify-between px-6 py-6 md:px-10">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 h-16 pr-4 shrink-0">
        <div className="bg-orange-500 p-2 rounded-lg">
          <Music className="h-6 w-6 text-white" />
        </div>
        <span className="hidden lg:block font-bold text-lg text-gray-900 dark:text-white">
          SoundWave
        </span>
      </Link>

      <nav className="flex items-center gap-4">
        <Button
          ghost
          onClick={handleAuth}
          className="text-white hover:text-white hover:bg-white/10"
        >
          Sign in
        </Button>

        <Button
          light
          onClick={handleAuth}
          className="font-bold border-none rounded-full"
        >
          Create account
        </Button>
      </nav>
    </header>
  );
}

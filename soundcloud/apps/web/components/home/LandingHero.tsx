"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export default function LandingHero() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const encodedQuery = encodeURIComponent(query.trim());
      router.push(`/search?q=${encodedQuery}`);
    }
  };

  return (
    <section className="relative h-[600px] w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/istockphoto-2161509311-612x612.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-white dark:to-[#121212]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center px-4 text-center">
        <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white md:text-7xl">
          Connect on <span className="text-orange-500">SoundWave</span>
        </h1>
        <p className="mb-10 text-lg text-gray-200 md:text-xl max-w-2xl">
          Discover, stream, and share a constantly expanding mix of music from
          emerging and major artists around the world.
        </p>

        {/* Search Area */}
        <form
          onSubmit={handleSearch}
          className="relative w-full max-w-2xl group"
        >
          <Input
            size="lg"
            placeholder="Search for artists, bands, tracks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftIcon={
              <Search className="h-6 w-6 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            }
            className="rounded-full! pr-36! border-none! shadow-2xl bg-white! dark:bg-neutral-900! focus:ring-4! focus:ring-orange-500/30!"
          />

          <Button
            type="submit"
            className="absolute inset-y-2 right-2 bg-orange-600! hover:bg-orange-700! text-white! border-none! rounded-full px-6"
          >
            Search
          </Button>
        </form>
      </div>
    </section>
  );
}

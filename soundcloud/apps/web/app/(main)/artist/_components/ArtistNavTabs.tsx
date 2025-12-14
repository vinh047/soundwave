"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { path: "", label: "All" },
  { path: "tracks", label: "Tracks" },
  { path: "playlists", label: "Playlists" },
  { path: "reposts", label: "Reposts" },
  { path: "likes", label: "Likes" },
  { path: "followers", label: "Followers" },
  { path: "following", label: "Following" },
];

export function ArtistNavTabs({ artistId }: { artistId: string }) {
  const pathname = usePathname();
  const baseUrl = `/artist/${artistId}`;

  return (
    <div className="mb-8 sticky top-0 bg-[#f2f2f2]/95 dark:bg-[#121212]/95 backdrop-blur-sm z-40 pt-3 border-b border-gray-300/60 dark:border-white/10">
      <nav className="flex gap-8 overflow-x-auto no-scrollbar pb-3">
        {tabs.map((tab) => {
          const tabPath = tab.path ? `${baseUrl}/${tab.path}` : baseUrl;

          const isActive = pathname === tabPath || pathname === `${tabPath}/`;

          return (
            <Link
              key={tab.path}
              href={tabPath}
              className={`
                pb-3 border-b-2 font-semibold text-[15px] whitespace-nowrap transition-all
                ${
                  isActive
                    ? "border-[#ff5500] text-[#ff5500]"
                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                }
              `}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

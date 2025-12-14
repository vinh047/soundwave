"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { name: "Overview", href: "/library" },
  { name: "Likes", href: "/library/likes" },
  { name: "Playlists", href: "/library/playlists" },
  { name: "Following", href: "/library/following" },
  { name: "History", href: "/library/history" },
  { name: "Uploads", href: "/library/uploads" },
];

export function LibraryTabs() {
  const pathname = usePathname();

  return (
    <div className="mb-8 border-b border-gray-200 dark:border-gray-800">
      <h1 className="mb-6 text-4xl font-bold">Library</h1>
      <div className="flex w-full justify-start gap-8 bg-transparent p-0">
        {tabs.map((tab) => {
          const isActive = tab.href === "/library"
            ? pathname === "/library"
            : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`border-b-2 px-0 pb-4 pt-0 text-lg font-semibold transition-colors ${isActive
                  ? "border-orange-500 text-orange-500"
                  : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
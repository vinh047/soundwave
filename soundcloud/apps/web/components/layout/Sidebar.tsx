import Link from "next/link";
import { Home, Search, Library, Heart, PlusSquare } from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Search, label: "Search", href: "/search" },
  { icon: Library, label: "Your Library", href: "/library" },
  { icon: Heart, label: "Liked Tracks", href: "/likes" },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:block fixed left-0 top-16 bottom-0 w-64 bg-black border-r border-gray-800 p-4 overflow-y-auto">
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-900 hover:text-white transition"
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-8">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
          Playlists
        </h3>
        <div className="space-y-1">
          {["Chill Vibes", "Workout", "Focus", "Party"].map((name) => (
            <Link
              key={name}
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-900 hover:text-white transition"
            >
              <div className="w-8 h-8 bg-linear-to-br from-orange-600 to-purple-600 rounded flex items-center justify-center text-xs font-bold">
                {name[0]}
              </div>
              <span className="truncate">{name}</span>
            </Link>
          ))}
          <button className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-900 hover:text-white transition w-full">
            <PlusSquare className="h-5 w-5" />
            <span>Create Playlist</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
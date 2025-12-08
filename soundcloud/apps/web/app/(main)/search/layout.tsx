"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Footer } from "../home/_components/Footer"; 
export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const query = searchParams.get("q") || "";

  const tabs = [
    { name: "Everything", href: "/search", exact: true },
    { name: "Tracks", href: "/search/tracks", exact: false },
    { name: "People", href: "/search/people", exact: false },
    { name: "Playlists", href: "/search/playlists", exact: false },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] transition-colors duration-300 flex flex-col">
      {/* WRAPPER CHÍNH:
         - Dùng container mx-auto để căn giữa.
         - Padding (px-4 md:px-8) để không sát lề.
      */}
      <div className="container mx-auto px-4 md:px-8 py-8 flex-1">
        
        {/* GRID SYSTEM:
           - Mobile: 1 cột.
           - Desktop (md trở lên): 2 cột (Sidebar 240px - Nội dung 1fr).
           - Gap-8: Khoảng cách giữa 2 cột.
        */}
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] gap-8">
          
          {/* --- CỘT TRÁI: NAVIGATION SIDEBAR --- */}
          <aside className="w-full md:w-auto shrink-0">
            {/* Sticky chỉ hoạt động trên Desktop để menu trượt theo khi cuộn */}
            <div className="md:sticky md:top-24">
              <h1 
                className="text-2xl font-bold mb-6 truncate text-gray-900 dark:text-white" 
                title={`Search results for "${query}"`}
              >
                Search results for <br className="hidden md:block" /> 
                <span className="text-orange-500">"{query}"</span>
              </h1>
              
              <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-4 md:pb-0 border-b md:border-b-0 border-gray-100 dark:border-gray-800 scrollbar-hide">
                {tabs.map((tab) => {
                  const isActive = tab.exact 
                    ? pathname === tab.href 
                    : pathname.startsWith(tab.href) && tab.href !== "/search";

                  return (
                    <Link
                      key={tab.name}
                      href={`${tab.href}?q=${encodeURIComponent(query)}`}
                      className={cn(
                        "px-4 py-2.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap text-left flex items-center justify-between group",
                        isActive
                          ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1A1A1A] dark:hover:text-white"
                      )}
                    >
                      {tab.name}
                      {/* Thêm mũi tên nhỏ chỉ hiện khi hover ở desktop (trang trí) */}
                      {isActive && <span className="hidden md:block">●</span>}
                    </Link>
                  );
                })}
              </nav>

              {/* Bộ lọc phụ (Ví dụ: Filter by date/duration) - Để trống chờ phát triển */}
              {/* <div className="hidden md:block mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Filters
                </p>
                <div className="text-sm text-gray-500 italic">Coming soon...</div>
              </div> */}
            </div>
          </aside>

          {/* --- CỘT PHẢI: MAIN CONTENT --- */}
          {/* min-w-0 là RẤT QUAN TRỌNG: 
             Nó ngăn Flex/Grid item bị vỡ khi nội dung con (như tên bài hát dài) 
             cố tình đẩy chiều rộng ra.
          */}
          <main className="min-w-0 flex-1">
            {children}
          </main>
        </div>
      </div>
      
      {/* Footer nằm dưới cùng */}
      <Footer />
    </div>
  );
}
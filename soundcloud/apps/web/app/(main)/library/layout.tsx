"use client";

import { LibraryTabs } from "./_components/LibraryTabs";

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white pb-20 text-gray-900 dark:bg-[#121212] dark:text-white">
      <div className="px-4 py-8 md:px-8">
        <LibraryTabs />

        <div className="mt-10">{children}</div>
      </div>
    </div>
  );
}

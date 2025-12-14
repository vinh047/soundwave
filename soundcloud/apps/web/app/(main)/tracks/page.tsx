import type { Metadata } from "next";
import TracksManager from "./_components/TracksManager";

export const metadata: Metadata = {
  title: "Quản lý bài hát | Studio",
  description: "Quản lý các tác phẩm âm nhạc của bạn",
};

export default function MyTracksPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 pb-20 font-sans overflow-hidden">
      {/* Background Decor - Phần tĩnh render trên Server để tránh layout shift */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten opacity-70 animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten opacity-70 animate-blob animation-delay-2000" />
      </div>

      {/* Gọi Client Component xử lý logic */}
      <TracksManager />
    </div>
  );
}
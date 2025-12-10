"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import playlistApi from "@/lib/api/playlistApi";
import { SearchPlaylistList } from "./_components/SearchPlaylistList"; 

export default function SearchPlaylistsPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Gọi API searchPlaylists (đã rút gọn ở bước trước)
        const res = await playlistApi.searchPlaylists({ 
          q, 
          limit: 10 // Hoặc 12, 15 tuỳ bạn muốn hiện bao nhiêu
        });
        setData(res.data);
      } catch (error) {
        console.error("Lỗi tải playlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [q]);

  // --- Render States ---

  if (!q) {
    return (
      <div className="mt-10 text-center text-gray-500 italic">
        Enter a keyword to search for playlists.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div>
      {/* Header kết quả tìm kiếm */}
      <div className="text-gray-500 text-sm mb-6 pb-3 border-b border-gray-100 dark:border-gray-800 font-medium">
        Found {data.total} playlists for &quot;<span className="text-gray-900 dark:text-white">{q}</span>&quot;
      </div>
      
      {/* Danh sách Playlist */}
      <SearchPlaylistList playlists={data.data} />
      
      {/* Pagination (Nếu cần) - Hiện tại load 1 trang */}
      {/* Bạn có thể thêm nút "Load more" ở đây nếu muốn mở rộng sau này */}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import playlistApi from "@/lib/api/playlistApi";
import { SearchPlaylistList } from "./_components/SearchPlaylistList";
import { Loader2 } from "lucide-react";
import { useInView } from "react-intersection-observer"; // 👇 Import thư viện

export default function SearchPlaylistsPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");

  // State quản lý danh sách và phân trang
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Hook bắt sự kiện cuộn xuống đáy
  const { ref, inView } = useInView();
  const LIMIT = 1; // Số lượng playlist tải mỗi lần

  // 1. Khi từ khóa (q) thay đổi -> Reset và tải trang 1
  useEffect(() => {
    if (!q) return;

    const fetchFirstPage = async () => {
      setLoading(true);
      setPage(1);
      setHasMore(true);
      setPlaylists([]); // Xóa dữ liệu cũ ngay lập tức

      try {
        const res = await playlistApi.searchPlaylists({ 
          q, 
          limit: LIMIT,
          page: 1 
        });

        // Giả sử API trả về cấu trúc giống Track: res.data.data và res.data.total
        // Nếu API Playlist trả về khác (VD: res.data trực tiếp là mảng), bạn cần sửa chỗ này
        const items = res.data?.data || [];
        const totalCount = res.data?.total || 0;

        setPlaylists(items);
        setTotal(totalCount);

        if (items.length < LIMIT) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Lỗi tải playlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFirstPage();
  }, [q]);

  // 2. Khi cuộn xuống đáy -> Tải trang tiếp theo
  useEffect(() => {
    if (inView && hasMore && !loading && q) {
      loadMore();
    }
  }, [inView, hasMore, loading, q]);

  const loadMore = async () => {
    setLoading(true);
    const nextPage = page + 1;

    try {
      const res = await playlistApi.searchPlaylists({ 
        q: q!, 
        limit: LIMIT, 
        page: nextPage 
      });

      const newItems = res.data?.data || [];

      if (newItems.length > 0) {
        // 👇 Logic nối mảng quan trọng
        setPlaylists((prev) => [...prev, ...newItems]);
        setPage(nextPage);
      }

      if (newItems.length < LIMIT) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Lỗi tải thêm playlist:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Render ---

  if (!q) {
    return (
      <div className="mt-10 text-center text-gray-500 italic">
        Enter a keyword to search for playlists.
      </div>
    );
  }

  return (
    <div>
      {/* Header kết quả */}
      <div className="text-gray-500 text-sm mb-6 pb-3 border-b border-gray-100 dark:border-gray-800 font-medium">
        Found {total} playlists for &quot;<span className="text-gray-900 dark:text-white">{q}</span>&quot;
      </div>
      
      {/* Danh sách Playlist */}
      <SearchPlaylistList playlists={playlists} />
      
      {/* 👇 Phần Loading & Sentinel (Mốc cuộn) */}
      <div className="py-8 flex justify-center w-full">
        {loading && <Loader2 className="animate-spin text-orange-500 w-6 h-6" />}
        
        {/* Thẻ div tàng hình để kích hoạt loadMore */}
        {!loading && hasMore && <div ref={ref} className="h-4 w-full" />}
        
        {!hasMore && playlists.length > 0 && (
           <p className="text-xs text-gray-400 mt-4">End of results.</p>
        )}

        {!loading && playlists.length === 0 && (
            <p className="text-sm text-gray-500">No playlists found.</p>
        )}
      </div>
    </div>
  );
}
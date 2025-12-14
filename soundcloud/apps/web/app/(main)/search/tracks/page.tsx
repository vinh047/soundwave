"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import trackApi from "@/lib/api/trackApi"; // Import bản Client
import { SearchTrackList } from "@/components/track/SearchTrackList";
import { Loader2 } from "lucide-react";
import { useInView } from "react-intersection-observer";

export default function SearchTracksPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  // State
  const [tracks, setTracks] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Hook theo dõi điểm cuối trang
  const { ref, inView } = useInView();
  const LIMIT = 10; 

  // 1. Reset và Fetch trang đầu tiên khi từ khóa (q) thay đổi
  useEffect(() => {
    if (!q) return;

    const fetchFirstPage = async () => {
      setLoading(true);
      setPage(1);       
      setHasMore(true); 
      setTracks([]);    

      try {
        const res = await trackApi.getTracks({ search: q, limit: LIMIT, page: 1 });
        
        // 👇 SỬA Ở ĐÂY: Dựa vào JSON bạn gửi
        // res.data là cục object to
        // res.data.data là mảng bài hát
        // res.data.total là tổng số
        const trackList = res.data?.data || [];
        const totalCount = res.data?.total || 0;

        setTracks(trackList);
        setTotal(totalCount);

        // Kiểm tra xem đã hết dữ liệu chưa
        if (trackList.length < LIMIT) {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Error fetching initial search:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFirstPage();
  }, [q]);

  // 2. Load More khi cuộn xuống đáy
  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMore();
    }
  }, [inView, hasMore]); // Bỏ loading để tránh loop

  const loadMore = async () => {
    setLoading(true);
    const nextPage = page + 1;

    try {
      const res = await trackApi.getTracks({ search: q, limit: LIMIT, page: nextPage });
      
      // 👇 SỬA Ở ĐÂY TƯƠNG TỰ
      const newTracks = res.data?.data || [];

      if (newTracks.length > 0) {
        setTracks((prev) => [...prev, ...newTracks]);
        setPage(nextPage);
      }

      if (newTracks.length < LIMIT) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error loading more:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!q) return <div className="p-4 text-gray-500">Please enter a keyword...</div>;

  return (
    <div>
      {/* Header hiển thị tổng số bài */}
      <div className="text-gray-500 text-sm mb-4 pb-3 border-b border-gray-100 dark:border-gray-800 font-medium">
        Found {total} tracks for "{q}"
      </div>

      {/* Danh sách bài hát */}
      <SearchTrackList tracks={tracks} />

      {/* 👇 LOADING & SENTINEL */}
      <div className="py-8 flex justify-center w-full">
        {loading && <Loader2 className="animate-spin text-orange-500 w-6 h-6" />}
        
        {!loading && hasMore && <div ref={ref} className="h-4 w-full" />}
        
        {!hasMore && tracks.length > 0 && (
           <p className="text-xs text-gray-400">End of results.</p>
        )}
      </div>
    </div>
  );
}
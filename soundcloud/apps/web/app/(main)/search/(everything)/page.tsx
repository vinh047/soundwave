"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import trackApi from "@/lib/api/trackApi";
import { SearchTrackList } from "@/components/track/SearchTrackList";
import { Loader2 } from "lucide-react";
import { useInView } from "react-intersection-observer";

export default function SearchEverythingPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  const [tracks, setTracks] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView();
  const LIMIT = 10;

  useEffect(() => {
    if (!q) return;

    const fetchFirstPage = async () => {
      setLoading(true);
      setPage(1);
      setHasMore(true);
      setTracks([]);

      try {
        const res = await trackApi.searchEverything({
          q,
          limit: LIMIT,
          page: 1,
        });

        const items = res.data?.data || [];
        const totalCount = res.data?.total || 0;

        setTracks(items);
        setTotal(totalCount);

        if (items.length < LIMIT) {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Lỗi tìm kiếm:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFirstPage();
  }, [q]);

  useEffect(() => {
    if (inView && hasMore && !loading && q) {
      loadMore();
    }
  }, [inView, hasMore, loading, q]);

  const loadMore = async () => {
    setLoading(true);
    const nextPage = page + 1;

    try {
      const res = await trackApi.searchEverything({
        q,
        limit: LIMIT,
        page: nextPage,
      });

      const newItems = res.data?.data || [];

      if (newItems.length > 0) {
        setTracks((prev) => [...prev, ...newItems]);
        setPage(nextPage);
      }

      if (newItems.length < LIMIT) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Lỗi tải thêm:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!q) {
    return (
      <div className="mt-10 text-center text-gray-500 italic">
        Enter a keyword to search.
      </div>
    );
  }

  return (
    <div>
      {/* Header hiển thị tổng số kết quả */}
      <div className="text-gray-500 text-sm mb-4 pb-3 border-b border-gray-100 dark:border-gray-800 font-medium">
        Found {total} tracks matching "
        <span className="text-gray-900 dark:text-white">{q}</span>"
      </div>

      {/* Danh sách bài hát */}
      <SearchTrackList tracks={tracks} />

      {/* 👇 PHẦN LOADING & SENTINEL (Điểm mốc cuộn) */}
      <div className="py-8 flex justify-center w-full">
        {loading && (
          <Loader2 className="animate-spin text-orange-500 w-6 h-6" />
        )}

        {/* Div tàng hình để trigger loadMore */}
        {!loading && hasMore && <div ref={ref} className="h-4 w-full" />}

        {!hasMore && tracks.length > 0 && (
          <p className="text-xs text-gray-400 mt-4">End of results.</p>
        )}

        {!loading && tracks.length === 0 && (
          <p className="text-sm text-gray-500">No tracks found.</p>
        )}
      </div>
    </div>
  );
}

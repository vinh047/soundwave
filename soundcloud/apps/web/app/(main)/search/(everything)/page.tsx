"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import trackApi from "@/lib/api/trackApi";
import { SearchTrackList } from "@/components/track/SearchTrackList";

export default function SearchEverythingPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await trackApi.searchEverything({
          q: q,
          limit: 5,
        });
        setData(res.data);
      } catch (error) {
        console.error("Lỗi tìm kiếm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [q]);

  if (!q) {
    return (
      <div className="text-gray-500 mt-8 italic">
        Vui lòng nhập từ khóa để tìm kiếm.
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
    <div className="space-y-8">
      <section>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Tracks
          </h2>

          {data.total > 5 && (
            <Link
              href={`/search/tracks?q=${encodeURIComponent(q)}`}
              className="text-xs text-gray-500 hover:text-orange-500 transition-colors"
            >
              View all tracks
            </Link>
          )}
        </div>

        {/* Dữ liệu lấy từ Client đã có cookie nên sẽ có field likes/reposts đầy đủ */}
        <SearchTrackList tracks={data.data} />
      </section>
    </div>
  );
}

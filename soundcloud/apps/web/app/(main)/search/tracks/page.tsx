"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import trackApi from "@/lib/api/trackApi";
import { SearchTrackList } from "@/components/track/SearchTrackList";

export default function SearchTracksPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await trackApi.getTracks({ search: q, limit: 20 });
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [q]);

  if (loading) return <div>Loading...</div>;
  if (!data) return null;

  return (
    <div>
      <div className="text-gray-500 text-sm mb-4 pb-3 border-b border-gray-100 dark:border-gray-800 font-medium">
        Found {data.total} tracks for "{q}"
      </div>
      <SearchTrackList tracks={data.data} />
    </div>
  );
}

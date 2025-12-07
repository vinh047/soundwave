"use client";

import React, { useEffect, useState } from "react";
import trackApi from "@/lib/api/trackApi";
import { TrackList } from "@/components/track/TrackList";
// 1. Import thêm User để định nghĩa type đúng
import { Track, User } from "@repo/database"; 

// 2. Định nghĩa type cho Track có kèm User (để thỏa mãn TrackList)
type TrackWithUser = Track & { user: User };

export const RecentTracks = () => {
  // 3. Sửa type của State: Không phải Track[] mà là TrackWithUser[]
  const [tracks, setTracks] = useState<TrackWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await trackApi.getRecentTracks();
        
        if (res.data && Array.isArray(res.data)) {
            setTracks(res.data as any);
            setIsLoggedIn(true);
        }
      } catch (error) {
        // console.log("User chưa login");
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, []);

  if (loading) {
    return (
        <div className="mb-12">
            <div className="h-8 w-48 bg-gray-200 animate-pulse mb-6 rounded"></div>
            <div className="grid grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-md"></div>
                ))}
            </div>
        </div>
    );
  }

  if (!isLoggedIn || tracks.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Nghe gần đây
      </h2>
      {/* Bây giờ tracks đã đúng kiểu mà TrackList yêu cầu */}
      <TrackList tracks={tracks} />
    </section>
  );
};
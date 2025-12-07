"use client";

import React, { useEffect, useState } from "react";
import trackApi from "@/lib/api/trackApi";
import { TrackList } from "@/components/track/TrackList";
import { useAuth } from "@/app/contexts/AuthContext";
import { Track, User } from "@repo/database";
import { TrackListSkeleton } from "@/components/track/TrackListSkeleton";

type TrackWithUser = Track & { user: User };

export const RecentTracks = () => {
  // 2. Lấy trạng thái đăng nhập từ Context
  const { isLoggedIn, isLoading: isAuthLoading } = useAuth();

  const [tracks, setTracks] = useState<TrackWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 3. Chỉ gọi API khi đã xác xác nhận ĐÃ ĐĂNG NHẬP
    if (!isLoggedIn) return;

    const fetchRecent = async () => {
      try {
        setLoading(true);
        const res = await trackApi.getRecentTracks();

        if (res.data && Array.isArray(res.data)) {
          setTracks(res.data as any);
        }
      } catch (error) {
        console.error("Lỗi lấy recent tracks", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, [isLoggedIn]);

  // 4. Xử lý hiển thị

  // Trường hợp 1: Auth đang check -> Có thể return null hoặc Skeleton tùy bạn
  if (isAuthLoading) return null;

  // Trường hợp 2: Chưa đăng nhập -> Ẩn
  if (!isLoggedIn) return null;

  // Trường hợp 3: Đang load API -> Hiện Skeleton chuẩn
  if (loading) {
    return (
      <section className="mb-12">
        {/* Skeleton cho tiêu đề (giữ chỗ cho chữ "Nghe gần đây") */}
        <div className="h-8 w-48 bg-gray-200 dark:bg-zinc-800 animate-pulse mb-6 rounded" />

        {/* Skeleton cho danh sách Track (Carousel) */}
        <TrackListSkeleton />
      </section>
    );
  }

  // Trường hợp 4: Load xong nhưng rỗng -> Ẩn
  if (tracks.length === 0) return null;

  // Trường hợp 5: Có dữ liệu -> Hiển thị
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Nghe gần đây
      </h2>
      <TrackList tracks={tracks} />
    </section>
  );
};

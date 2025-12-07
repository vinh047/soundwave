import React from "react";
import { TrackCardSkeleton } from "./TrackCardSkeleton";

export function TrackListSkeleton() {
  // Tạo mảng giả gồm 5-6 phần tử để lấp đầy màn hình
  const skeletons = Array.from({ length: 6 });

  return (
    <div className="relative w-full">
      {/* Giữ nguyên cấu trúc div bọc ngoài giống TrackList thật */}
      <div className="overflow-hidden">
        {/* Giữ nguyên gap và flex */}
        <div className="flex gap-4 sm:gap-6">
          {skeletons.map((_, index) => (
            <div
              key={index}
              // ⚠️ QUAN TRỌNG: Copy chính xác class responsive từ TrackList sang đây
              // Để skeleton chiếm diện tích y hệt card thật
              className="flex-[0_0_85%] sm:flex-[0_0_45%] md:flex-[0_0_30%] lg:flex-[0_0_20%] min-w-0"
            >
              <TrackCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
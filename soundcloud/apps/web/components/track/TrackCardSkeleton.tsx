import React from "react";

export function TrackCardSkeleton() {
  // Các class dùng chung cho các khối placeholder để gọn code
  const pulseClass = "bg-gray-200 dark:bg-gray-800 animate-pulse rounded";

  return (
    <div
      // Sao chép y nguyên container class từ TrackCard thật
      // Bỏ các class tương tác (cursor-pointer, hover:...)
      // Thêm select-none và pointer-events-none để tránh người dùng click nhầm
      className={`
        rounded-lg p-4 block select-none pointer-events-none
        
        /* 🔥 Light mode container */
        bg-white border border-gray-200 shadow-sm

        /* 🌙 Dark mode container */
        dark:bg-gray-900 dark:border-gray-700
      `}
    >
      {/* 1. Placeholder cho Ảnh (Aspect Square) */}
      <div className={`w-full aspect-square ${pulseClass}`} />

      {/* 2. Placeholder cho Title (h3) */}
      {/* mt-3 khớp với TrackCard */}
      <div className={`mt-3 h-6 w-3/4 ${pulseClass}`} />

      {/* 3. Placeholder cho Artist Name (p) */}
      {/* Thêm mt-2 nhẹ để tạo khoảng cách thị giác */}
      <div className={`mt-2 h-4 w-1/2 ${pulseClass}`} />

      {/* 4. Placeholder cho Metadata row (div flex) */}
      {/* mt-2 flex gap-2 khớp với TrackCard */}
      <div className="flex gap-2 mt-2">
        {/* Đại diện cho play count */}
        <div className={`h-3 w-12 ${pulseClass}`} />
        {/* Đại diện cho dấu chấm vào time ago */}
        <div className={`h-3 w-16 ${pulseClass}`} />
      </div>
    </div>
  );
}
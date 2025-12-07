"use client";

import Image from "next/image";
import {
  BadgeCheck,
  Share2,
  UserPlus,
  MessageSquare,
  Star,
} from "lucide-react";
import { Prisma } from "@repo/database";

interface ArtistHeaderProps {
  user: Prisma.UserGetPayload<{
    include: {
      profile: true;
    };
  }>;
}

export default function ArtistHeader({ user }: ArtistHeaderProps) {
  // Fallback cover image
  const coverImage = "https://picsum.photos/id/10/1200/400"; // Lấy ảnh khổ rộng hơn cho đẹp

  return (
    // THAY ĐỔI 1: Thêm mb-16 (hoặc mb-20) để tạo khoảng trống cho Avatar lòi xuống dưới
    <div className="relative w-full bg-[#333] group mb-16 md:mb-20">
      {/* 1. Cover Image Section */}
      <div className="relative h-[260px] md:h-[340px] w-full">
        <Image
          src={coverImage || null}
          alt="Cover"
          fill
          className="object-cover"
          priority
        />
        {/* Lớp phủ tối dần (Gradient) để text dễ đọc hơn */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent group-hover:bg-black/40 transition duration-500"></div>
      </div>

      {/* 2. Main Content Wrapper */}
      <div className="absolute inset-0 max-w-7xl mx-auto px-4 md:px-8">
        {/* Actions Bar (Top Right hoặc Bottom Right tùy ý, ở đây giữ nguyên vị trí cũ nhưng chỉnh lại z-index) */}
        <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 flex gap-2 md:gap-3 z-20 items-end">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#ff5500] hover:bg-[#e04b00] text-white rounded-[3px] text-sm font-bold transition shadow-md uppercase tracking-wide">
            <UserPlus size={18} />
            <span className="hidden md:inline">Follow</span>
          </button>

          <button className="flex items-center justify-center w-9 h-9 md:w-auto md:h-auto md:px-3 md:py-2 bg-transparent border border-gray-400 hover:border-white text-white hover:bg-white/10 rounded-[3px] text-sm font-medium transition">
            <Share2 size={18} />
            <span className="hidden md:inline ml-2">Share</span>
          </button>

          <button className="flex items-center justify-center w-9 h-9 bg-transparent border border-gray-400 hover:border-white text-white hover:bg-white/10 rounded-[3px] transition">
            <MessageSquare size={18} />
          </button>
        </div>

        {/* 3. Avatar & Info Area */}
        <div className="absolute bottom-0 left-4 md:left-8 flex flex-col md:flex-row items-end gap-6 w-full">
          {/* THAY ĐỔI 2: AVATAR VUÔNG & ĐÈ XUỐNG */}
          {/* translate-y-1/2: Đẩy xuống 50% chiều cao của chính nó */}
          <div className="relative translate-y-1/2 z-30 shrink-0">
            <div className="relative w-32 h-32 md:w-48 md:h-48 bg-white p-1 shadow-xl rounded-md">
              <div className="relative w-full h-full bg-gray-200 rounded-xs overflow-hidden">
                <Image
                  src={user.image || "/images/default-avatar.png"}
                  alt={user.name || "Artist"}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Pro Badge (Chỉnh lại vị trí cho hợp với hình vuông) */}
            <div className="absolute -top-3 -right-3 bg-[#3897f0] text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded shadow-md flex items-center gap-1 z-40 border-2 border-white">
              <Star size={10} fill="currentColor" /> <span>PRO</span>
            </div>
          </div>

          {/* Text Info - Nằm bên phải avatar, vẫn nằm trên nền Cover */}
          <div className="flex-1 pb-6 md:pb-8 z-20 md:pl-2">
            <div className="inline-block">
              <h1 className="text-3xl md:text-5xl text-white font-black tracking-tight flex items-center gap-3 drop-shadow-md">
                {user.name}
                <BadgeCheck className="text-[#3897f0] w-6 h-6 md:w-8 md:h-8 fill-current" />
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-2">
              {user.profile?.location && (
                <p className="text-gray-200 text-sm md:text-base font-medium flex items-center gap-1 drop-shadow-sm">
                  {user.profile.location}
                </p>
              )}
              <span className="hidden md:inline text-gray-400">•</span>
              <span className="bg-black/30 backdrop-blur-md text-white text-xs px-2 py-0.5 rounded border border-white/20 font-semibold uppercase tracking-wider">
                R&B / Soul
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

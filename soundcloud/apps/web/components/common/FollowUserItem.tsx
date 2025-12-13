"use client";

import Image from "next/image";
import Link from "next/link";
import { UserPlus } from "lucide-react";

interface FollowUserItemProps {
  user: {
    id: string;
    name: string | null;
    image: string | null;
    createdAt: Date;
  };
  relationType: "follower" | "following";
}

export default function FollowUserItem({
  user,
  relationType,
}: FollowUserItemProps) {
  const defaultAvatar = "/images/default-avatar.png";
  
  const dateLabel = relationType === "follower" ? "Followed" : "Since";

  return (
    <div className="group flex flex-col items-center p-4 rounded-xl transition-all duration-300">
      {/* 1. Avatar tròn lớn (SoundCloud Style) */}
      <Link href={`/artist/${user.id}`} className="relative mb-3">
        {/* Tạo hiệu ứng viền cam khi hover giống SoundCloud */}
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full relative overflow-hidden shadow-md group-hover:shadow-[0_4px_20px_rgba(255,85,0,0.3)] transition-all duration-300 ring-2 ring-transparent group-hover:ring-[#ff5500] bg-gray-100 dark:bg-zinc-800">
          <Image
            src={user.image || defaultAvatar}
            alt={user.name || "User"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </Link>

      {/* 2. Thông tin User (Căn giữa) */}
      <div className="text-center w-full mb-3">
        <Link
          href={`/artist/${user.id}`}
          className="text-base font-bold text-gray-900 dark:text-white hover:text-[#ff5500] truncate block px-2"
          title={user.name || "Unknown User"}
        >
          {user.name || "Unknown User"}
        </Link>
        <p className="text-xs text-gray-500 mt-1 font-medium">
          {dateLabel} {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* 3. Action Button */}
      <button className="flex items-center justify-center gap-1.5 text-xs font-semibold px-6 py-1.5 bg-transparent border border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer hover:border-[#ff5500] hover:text-[#ff5500] transition-colors min-w-[100px]">
        <UserPlus size={14} />
        Follow
      </button>
    </div>
  );
}

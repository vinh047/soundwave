"use client";

import Image from "next/image";
import { BadgeCheck, MapPin, Share2, UserPlus } from "lucide-react";
import { Prisma } from "@repo/database"; // Hoặc import type từ schema

interface ArtistHeaderProps {
  user: Prisma.UserGetPayload<{
    include: {
      tracks: true;
      playlists: true;
      likes: true;
      reposts: true;
      reports: true;
      comments: true;
      following: true;
      followers: true;
      profile: true;
    };
  }>;
}

export default function ArtistHeader({ user }: ArtistHeaderProps) {
  return (
    <div className="relative w-full bg-linear-to-r from-slate-800 to-slate-900 h-[260px] md:h-[340px]">
      {/* Banner Background (Nếu schema có banner thì thay bằng Image) */}
      <div className="absolute inset-0 bg-black/30 z-0"></div>

      <div className="absolute top-8 left-8 right-8 bottom-8 flex flex-col md:flex-row items-start md:items-end gap-6 z-10">
        {/* Avatar */}
        <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white/20 shadow-2xl overflow-hidden shrink-0">
          <Image
            src={user.image || "/images/default-avatar.png"}
            alt={user.name || "Artist"}
            fill
            className="object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 mb-2">
          <div className="bg-black/40 backdrop-blur-sm inline-block px-3 py-1 rounded text-xs text-white mb-2">
            Artist
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center gap-2 bg-black/20 w-fit px-2 rounded-lg backdrop-blur-xs">
            {user.name}
            <BadgeCheck className="text-blue-400 w-6 h-6 md:w-8 md:h-8" />
          </h1>

          {user.profile?.location && (
            <p className="text-gray-300 mt-2 flex items-center gap-1.5 text-sm md:text-base font-medium">
              <MapPin className="w-4 h-4" /> {user.profile.location}
            </p>
          )}
        </div>

        {/* Actions (Right side aligned bottom) */}
        <div className="flex gap-3 mb-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#ff5500] hover:bg-[#e04b00] text-white rounded-md font-bold transition shadow-lg">
            <UserPlus size={18} />
            Follow
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-md font-bold transition backdrop-blur-md">
            <Share2 size={18} />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}

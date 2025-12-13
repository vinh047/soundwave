"use client";

import Image from "next/image";
import Link from "next/link";
import { ListMusic, Play } from "lucide-react";
import { Prisma } from "@repo/database";

interface PlaylistGridItemProps {
  playlist: Prisma.PlaylistGetPayload<{
    include: {
      user: true;
      tracks: {
        include: {
          track: {
            include: { user: true };
          };
        };
      };
      _count: { select: { tracks: true } };
    };
  }>;
}

export function PlaylistGridItem({ playlist }: PlaylistGridItemProps) {
  // Logic lấy ảnh bìa: Dùng ảnh của bài hát đầu tiên, nếu không có thì null
  const firstTrack = playlist.tracks?.[0]?.track;
  const coverImage = firstTrack?.imagePath;
  const playlistLink = `/playlists/${playlist.id}`;

  // Nếu service dùng _count thì lấy từ _count, nếu không thì đếm mảng (fallback)
  const trackCount = playlist._count?.tracks ?? playlist.tracks?.length ?? 0;

  return (
    <Link
      href={playlistLink}
      className="group flex flex-col gap-2 cursor-pointer p-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
    >
      {/* IMAGE CONTAINER */}
      <div className="aspect-square w-full relative overflow-hidden rounded-md border border-gray-200 dark:border-white/10 shadow-sm">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={playlist.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-[#222] text-gray-400">
            <ListMusic size={40} strokeWidth={1.5} />
          </div>
        )}

        {/* HOVER OVERLAY & PLAY BUTTON */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#ff5500] text-white flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <Play size={20} fill="currentColor" className="ml-1" />
          </div>
        </div>
      </div>

      {/* TEXT INFO */}
      <div className="flex flex-col min-w-0">
        <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate group-hover:text-[#ff5500] transition-colors">
          {playlist.title}
        </h4>
        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {playlist.user?.name || "Unknown User"}
        </span>
        <span className="text-[10px] text-gray-400 mt-0.5">
          {trackCount} tracks
        </span>
      </div>
    </Link>
  );
}

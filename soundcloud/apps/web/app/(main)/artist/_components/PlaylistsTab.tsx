"use client";

import { ListMusic } from "lucide-react";
import { Prisma } from "@repo/database";
import useSWR from "swr";
import userApi from "@/lib/api/usersApi";
import Image from "next/image";

type PlaylistWithRelations = Prisma.PlaylistGetPayload<{
  include: { tracks: { include: { track: true } } };
}>;

interface PlaylistsTabProps {
  userId: string;
}

// Export Skeleton
export const PlaylistSkeleton = () => (
  <div className="group animate-pulse">
    <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-1"></div>
    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
  </div>
);

// Wrapper Skeleton cho cả Grid
export const PlaylistsGridSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {[...Array(4)].map((_, i) => (
      <PlaylistSkeleton key={i} />
    ))}
  </div>
);

export default function PlaylistsTab({ userId }: PlaylistsTabProps) {
  const { data } = useSWR(
    userId ? [`/users/${userId}/playlists`, userId] : null,
    () => userApi.getAllPlaylistsByUserId(userId).then((res) => res.data.data),
    {
      suspense: true, // Bật Suspense
      revalidateOnFocus: false,
    }
  );

  // Không cần check isLoading nữa

  const playlists: PlaylistWithRelations[] = data || [];

  if (playlists.length === 0) {
    return (
      <div className="py-10 text-gray-500 text-center">No playlists found.</div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {playlists.map((pl) => {
        const coverImage = pl.tracks?.[0]?.track?.imagePath;
        return (
          <div key={pl.id} className="group cursor-pointer">
            <div className="aspect-square rounded mb-2 relative overflow-hidden border border-transparent group-hover:border-[#ff5500] transition">
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-100 dark:bg-[#181818]">
                {coverImage ? (
                  <Image
                    src={coverImage}
                    alt={pl.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <ListMusic size={32} />
                )}
              </div>
            </div>
            <h4 className="font-bold text-sm truncate group-hover:text-[#ff5500] dark:text-white transition-colors">
              {pl.title}
            </h4>
            <p className="text-xs text-gray-500">
              {pl.tracks?.length || 0} tracks
            </p>
          </div>
        );
      })}
    </div>
  );
}

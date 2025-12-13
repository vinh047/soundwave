"use client";

import { useLibraryData } from "../hooks/useLibraryData";
import { Loader2, Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LibraryPlaylistsPage() {
  // Lấy dữ liệu playlists và user (để hiện tên người tạo)
  const { user, isLoggedIn, isLoading, playlists } = useLibraryData();

  if (isLoading)
    return (
      <div className="flex h-[50vh] justify-center items-center">
        <Loader2 className="animate-spin text-orange-500" />
      </div>
    );
  if (!isLoggedIn) return null;

  return (
    <div className="px-4 py-8 md:px-8">
      <div className="mt-10">
        <section>
          <h2 className="mb-6 text-2xl font-bold border-b border-gray-800 pb-2">
            Playlists
          </h2>
          {playlists.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {playlists.map((playlist) => (
                <Link
                  href={`/playlists/${playlist.id}`}
                  key={playlist.id}
                  className="group block"
                >
                  {/* Phần hiển thị ảnh Playlist */}
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-md bg-gray-200 dark:bg-gray-800 group-hover:opacity-80 transition-opacity">
                    {playlist.tracks?.[0]?.track?.imagePath ? (
                      <Image
                        src={playlist.tracks[0].track.imagePath}
                        alt={playlist.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                        <span className="text-4xl">♪</span>
                      </div>
                    )}

                    {/* Nút Play hiện khi hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-orange-500 rounded-full p-3 text-white shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                        <Play size={24} fill="currentColor" />
                      </div>
                    </div>
                  </div>

                  {/* Tên Playlist & Tên User */}
                  <h3 className="truncate font-medium text-lg text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">
                    {playlist.title}
                  </h3>
                  <p className="truncate text-sm text-gray-500">{user?.name}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {playlist._count?.tracks || 0} tracks
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 border border-dashed rounded">
              You haven't created any playlists yet.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

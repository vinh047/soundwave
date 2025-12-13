"use client";

import { useLibraryData } from "../hooks/useLibraryData";
import { TrackCard } from "@/components/track/TrackCard";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LibraryOverviewPage() {
  const {
    user,
    isLoggedIn,
    isLoading,
    recentTracks,
    likedTracks,
    playlists,
    following,
  } = useLibraryData();

  if (isLoading)
    return (
      <div className="flex h-[50vh] justify-center items-center">
        <Loader2 className="animate-spin text-orange-500" />
      </div>
    );
  if (!isLoggedIn) return null;

  return (
    <div className="px-4 py-8 md:px-8">
      <div className="mt-10 space-y-16">
        {/* Section Recently Played */}
        <section>
          <h2 className="mb-6 text-2xl font-bold border-b border-gray-800 pb-2">
            Recently played
          </h2>
          {recentTracks.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {recentTracks.slice(0, 6).map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 border border-dashed rounded">
              You haven't listened to anything yet.
            </div>
          )}
        </section>

        {/* Section Likes */}
        <section>
          <h2 className="mb-6 text-2xl font-bold border-b border-gray-800 pb-2">
            Likes
          </h2>
          {/* Copy code render Likes cũ vào đây */}
          {likedTracks.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {likedTracks.slice(0, 6).map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 border border-dashed rounded">
              No likes yet.
            </div>
          )}
        </section>

        {/* Section Playlists - Code cũ của bạn */}
        <section>
          <h2 className="mb-6 text-2xl font-bold border-b border-gray-800 pb-2">
            Playlists
          </h2>
          {playlists.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {playlists.slice(0, 6).map((playlist) => (
                <Link
                  href={`/playlists/${playlist.id}`}
                  key={playlist.id}
                  className="group block"
                >
                  {/* ... (Code render Image playlist cũ của bạn giữ nguyên ở đây) ... */}
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-md bg-gray-200 dark:bg-gray-800">
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
                  </div>
                  <h3 className="truncate font-medium text-lg">
                    {playlist.title}
                  </h3>
                  <p className="truncate text-sm text-gray-500">{user?.name}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 border border-dashed rounded">
              No playlists yet.
            </div>
          )}
        </section>

        {/* Section Following - Code cũ của bạn */}
        <section>
          <h2 className="mb-6 text-2xl font-bold border-b border-gray-800 pb-2">
            Following
          </h2>
          {following.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {following.slice(0, 6).map((followedUser) => (
                <Link
                  href={`/artist/${followedUser.id}`}
                  key={followedUser.id}
                  className="flex flex-col items-center group"
                >
                  {/* ... (Code render Avatar user cũ của bạn giữ nguyên ở đây) ... */}
                  <div className="h-40 w-40 rounded-full overflow-hidden mb-3 border-2 border-transparent group-hover:border-orange-500">
                    {followedUser.image ? (
                      <Image
                        src={followedUser.image}
                        alt={followedUser.name || "User"}
                        width={160}
                        height={160}
                        className="object-cover h-full w-full"
                      />
                    ) : (
                      <div className="h-full w-full bg-orange-500 flex items-center justify-center text-white text-5xl">
                        {followedUser.name?.[0]}
                      </div>
                    )}
                  </div>
                  <span className="font-semibold">{followedUser.name}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 border border-dashed rounded">
              Not following anyone.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

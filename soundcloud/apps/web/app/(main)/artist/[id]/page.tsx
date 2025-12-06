import { notFound } from "next/navigation";

import ArtistSidebar from "../_components/ArtistSidebar";
import ArtistHeader from "../_components/ArtistHeader";
import userApi from "@/lib/api/usersApi";
import { TrackCard } from "@/components/track/TrackCard";

export default async function ArtistPage({
  params,
}: {
  params: { id: string };
}) {
  const res = await userApi.getUserById(params.id);
  const artist = res.data;

  if (!artist) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#121212]">
      {/* 1. Header Section */}
      <ArtistHeader user={artist} />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 2. Main Content (Left Column) - 8/12 */}
          <div className="lg:col-span-8">
            {/* Navigation Tabs */}
            <div className="mb-6 border-b border-gray-200 dark:border-white/10">
              <nav className="flex gap-8">
                <button className="pb-3 border-b-2 border-[#ff5500] text-[#ff5500] font-bold text-lg">
                  All
                </button>
                <button className="pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-white font-medium text-lg transition">
                  Popular Tracks
                </button>
                <button className="pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-white font-medium text-lg transition">
                  Albums
                </button>
                <button className="pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-white font-medium text-lg transition">
                  Playlists
                </button>
              </nav>
            </div>

            {/* Content List */}
            <div className="flex flex-col gap-4">
              {artist.tracks.length > 0 ? (
                artist.tracks.map((track) => (
                  <div
                    key={track.id}
                    className="bg-white dark:bg-[#181818] p-4 rounded-lg shadow-sm border border-gray-100 dark:border-white/5"
                  >
                    {/* Reuse TrackCard của bạn, nhưng có thể cần style lại chút cho list view nếu muốn */}
                    <TrackCard track={track} />
                  </div>
                ))
              ) : (
                <div className="text-center py-20 text-gray-500">
                  This artist hasn't uploaded any tracks yet.
                </div>
              )}
            </div>
          </div>

          {/* 3. Sidebar (Right Column) - 4/12 */}
          <div className="lg:col-span-4 pl-0 lg:pl-4">
            <ArtistSidebar stats={artist._count} profile={artist.profile} />
          </div>
        </div>
      </div>
    </main>
  );
}

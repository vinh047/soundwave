import { notFound } from "next/navigation";
import Image from "next/image";
import { Play, Heart } from "lucide-react";

import userApi, { ArtistProfileData } from "@/lib/api/usersApi";
import SpotlightSection from "../_components/SpotlightSection";

import PlaylistsTab from "../_components/PlaylistsTab";
import EmptyState from "../_components/EmptyState";

const SectionTitle = ({ title }: { title: string }) => (
  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-l-2 border-[#ff5500] pl-2">
    {title}
  </h3>
);

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let artist: ArtistProfileData | null = null;
  try {
    const res = await userApi.getArtistProfileData(id);
    artist = res.data;
  } catch (error) {
    console.error("Error fetching artist profile:", error);
  }

  if (!artist) {
    return notFound();
  }

  const tracks = artist.tracks || [];

  const spotlightTrack =
    tracks.length > 0
      ? tracks.reduce((prev, current) =>
          (prev.playCount || 0) > (current.playCount || 0) ? prev : current
        )
      : null;

  const recentTracks =
    tracks.length > 1 && spotlightTrack
      ? tracks.filter((t) => t.id !== spotlightTrack.id).slice(0, 5)
      : tracks.slice(0, 5);

  return (
    <div className="flex flex-col gap-10 pb-10">
      {/* 1. Spotlight Section */}
      <section>
        {spotlightTrack ? (
          <SpotlightSection track={spotlightTrack} />
        ) : (
          <EmptyState message="No tracks uploaded yet." />
        )}
      </section>

      {/* 2. Recent Tracks List */}
      {recentTracks.length > 0 && (
        <section>
          <SectionTitle title="Recent Uploads" />
          <div className="bg-white dark:bg-[#181818] rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden">
            {recentTracks.map((track, idx) => (
              <div
                key={track.id}
                className={`p-3 flex gap-4 hover:bg-gray-50 dark:hover:bg-white/5 transition group cursor-pointer ${
                  idx !== recentTracks.length - 1
                    ? "border-b border-gray-100 dark:border-white/5"
                    : ""
                }`}
              >
                {/* Track Image */}
                <div className="w-10 h-10 relative shrink-0">
                  <Image
                    src={track.imagePath || "/images/default-track.png"}
                    alt={track.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>

                {/* Track Info */}
                <div className="flex-1 flex justify-between items-center min-w-0">
                  <div className="truncate pr-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-[#ff5500]">
                      {track.title}
                    </h4>
                    <p className="text-xs text-gray-500">{artist?.name}</p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Play size={10} /> {track.playCount.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={10} /> {track.likes?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Playlists Preview */}
      {artist.playlists && artist.playlists.length > 0 && (
        <section>
          <SectionTitle title="Playlists" />
          {/* Reuse component PlaylistsTab nhưng có thể giới hạn số lượng nếu muốn, 
              hoặc hiển thị full component như dưới đây */}
          <PlaylistsTab userId={id} />
        </section>
      )}
    </div>
  );
}

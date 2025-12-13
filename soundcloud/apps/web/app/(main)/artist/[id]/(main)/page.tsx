import { notFound } from "next/navigation";

import userApi, { ArtistProfileData } from "@/lib/api/usersApi";
import SpotlightSection from "../../_components/SpotlightSection";

import PlaylistsTab from "../../_components/PlaylistsTab";
import EmptyState from "../../_components/EmptyState";
import { TrackListItemInteractive } from "../../_components/TrackListItemInteractive";

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
          <div className="rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden">
            {recentTracks.map((track) => (
              <TrackListItemInteractive key={track.id} track={track} />
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

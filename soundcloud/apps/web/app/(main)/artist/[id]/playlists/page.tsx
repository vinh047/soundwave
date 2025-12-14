import { ListMusic } from "lucide-react";
import userApi from "@/lib/api/usersApi";
import EmptyDisplay from "../../_components/EmptyDisplay";
import { PlaylistGridItem } from "../../_components/PlaylistGridItem";

export default async function PlaylistsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = id;
  let playlists;

  try {
    const res = await userApi.getAllPlaylistsByUserId(userId);
    playlists = res.data.data ?? [];
  } catch (error) {
    console.error("Failed to fetch user playlists:", error);
    return (
      <div className="py-10 text-red-500 text-center text-sm">
        Failed to load playlists.
      </div>
    );
  }

  // Handle Empty State
  if (playlists.length === 0) {
    return (
      <EmptyDisplay icon={ListMusic} message="No playlists created yet." />
    );
  }

  // Render Grid
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {playlists.map((playlist) => (
        <PlaylistGridItem key={playlist.id} playlist={playlist} />
      ))}
    </div>
  );
}

import { SearchPlaylistCard } from "./SearchPlaylistCard";

interface SearchPlaylistListProps {
  playlists: any[];
}

export function SearchPlaylistList({ playlists }: SearchPlaylistListProps) {
  if (!playlists || playlists.length === 0) {
    return <div className="text-gray-500 italic mt-4">No playlists found.</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {playlists.map((playlist) => (
        <SearchPlaylistCard key={playlist.id} playlist={playlist} />
      ))}
    </div>
  );
}
import { SearchTrackCard } from "./SearchTrackCard";

interface SearchTrackListProps {
  tracks: any[];
}

export function SearchTrackList({
  tracks,
}: SearchTrackListProps) {
  if (!tracks || tracks.length === 0) {
    return (
      <div className="text-gray-500 italic mt-4">
        No tracks found matching your search.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {" "}
      {/* Đổi gap-2 thành gap-4 cho thoáng hơn giống SoundCloud */}
      {tracks.map((track) => (
        <SearchTrackCard key={track.id} track={track} />
      ))}
    </div>
  );
}

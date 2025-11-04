import { TrackCard } from "./TrackCard";

interface TrackListProps {
  tracks: any[];
}

export function TrackList({ tracks }: TrackListProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {tracks.map((track) => (
        <TrackCard key={track.id} track={track} />
      ))}
    </div>
  );
}

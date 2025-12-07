import { ListMusic } from "lucide-react";
import { Prisma } from "@repo/database";

type PlaylistWithRelations = Prisma.PlaylistGetPayload<{
  include: { tracks: true }
}>;

interface PlaylistsTabProps {
  playlists: PlaylistWithRelations[];
}

export default function PlaylistsTab({ playlists }: PlaylistsTabProps) {
  if (playlists.length === 0) {
    return <div className="py-10 text-gray-500 text-center">No playlists found.</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {playlists.map((pl) => (
        <div key={pl.id} className="group cursor-pointer">
          <div className="aspect-square bg-gray-800 rounded mb-2 relative overflow-hidden border border-transparent group-hover:border-[#ff5500] transition">
            {/* Playlist Cover Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-100 dark:bg-[#181818]">
              <ListMusic size={32} />
            </div>
          </div>
          <h4 className="font-bold text-sm truncate group-hover:text-[#ff5500] dark:text-white transition-colors">
            {pl.title}
          </h4>
          <p className="text-xs text-gray-500">{pl.tracks?.length || 0} tracks</p>
        </div>
      ))}
    </div>
  );
}
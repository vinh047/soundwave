import { ListMusic } from "lucide-react";
import { Prisma } from "@repo/database";
import userApi from "@/lib/api/usersApi";
import Image from "next/image";
import Link from "next/link";

type PlaylistWithRelations = Prisma.PlaylistGetPayload<{
  include: { tracks: { include: { track: true } } };
}>;

export default async function PlaylistsPage({
  params,
}: {
  params: { id: string };
}) {
  const userId = params.id;

  let playlists: PlaylistWithRelations[] = [];
  try {
    const res = await userApi.getAllPlaylistsByUserId(userId);
    playlists = res.data.data ?? [];
  } catch (error) {
    console.error("Failed to fetch user playlists:", error);
  }

  if (playlists.length === 0) {
    return (
      <div className="py-10 text-gray-500 text-center">No playlists found.</div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {playlists.map((pl) => {
        const coverImage = pl.tracks?.[0]?.track?.imagePath;

        const playlistLink = `/playlists/${pl.id}`;

        return (
          <Link
            key={pl.id}
            href={playlistLink}
            className="group cursor-pointer"
          >
            <div className="aspect-square rounded mb-2 relative overflow-hidden border border-transparent group-hover:border-[#ff5500] transition">
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-100 dark:bg-[#181818]">
                {coverImage ? (
                  <Image
                    src={coverImage}
                    alt={pl.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <ListMusic size={32} />
                )}
              </div>
            </div>
            <h4 className="font-bold text-sm truncate group-hover:text-[#ff5500] dark:text-white transition-colors">
              {pl.title}
            </h4>
            <p className="text-xs text-grays-500">
              {pl.tracks?.length || 0} tracks
            </p>
          </Link>
        );
      })}
    </div>
  );
}

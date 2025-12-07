import { PrismaClient } from "@prisma/client";

export async function seedPlaylistTracks(prisma: PrismaClient) {
  console.log("📀 Seeding playlist tracks...");

  await prisma.playlistTrack.createMany({
    data: [
      // Chill playlist
      {
        id: "pl_chill_1",
        playlistId: "playlist_chill",
        trackId: "track_A1",
        order: 1,
      },
      {
        id: "pl_chill_2",
        playlistId: "playlist_chill",
        trackId: "track_A2",
        order: 2,
      },

    ],
    skipDuplicates: true,
  });
}

import { PrismaClient } from "@prisma/client";

export async function seedPlaylists(prisma: PrismaClient) {
  console.log("🎧 Seeding playlists...");

  const playlist = await prisma.playlist.upsert({
    where: { id: "playlist_chill" },
    update: {},
    create: {
      id: "playlist_chill",
      title: "Chill Vibes",
      description: "Relax and unwind with these tracks.",
      userId: "user_fan1",
      tracks: {
        create: [
          { order: 1, trackId: "track_1" },
          { order: 2, trackId: "track_2" },
        ],
      },
    },
  });

  console.log("→ Created playlist:", playlist.title);
}

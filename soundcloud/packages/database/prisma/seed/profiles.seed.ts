import { PrismaClient } from "@prisma/client";

export async function seedProfiles(prisma: PrismaClient) {
  console.log("🧩 Seeding profiles...");

  await prisma.profile.createMany({
    data: [
      {
        id: "profile_artist1",
        userId: "user_artist1",
        bio: "Electronic artist with dreamy synth vibes.",
        location: "Tokyo, Japan",
      },
      {
        id: "profile_artist2",
        userId: "user_artist2",
        bio: "Producer mixing chill and lo-fi beats.",
        location: "Berlin, Germany",
      },
    ],
    skipDuplicates: true,
  });
}

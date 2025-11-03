import { PrismaClient } from "@prisma/client";

export async function seedProfiles(prisma: PrismaClient) {
  console.log("🧩 Seeding profiles...");

  await prisma.profile.createMany({
    data: [
      {
        userId: "user_artist1",
        bio: "Electronic artist with dreamy synth vibes.",
        location: "Tokyo, Japan",
      },
      {
        userId: "user_artist2",
        bio: "Producer mixing chill and lo-fi beats.",
        location: "Berlin, Germany",
      },
    ],
    skipDuplicates: true,
  });
}

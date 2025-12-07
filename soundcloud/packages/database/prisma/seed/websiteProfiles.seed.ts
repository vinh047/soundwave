import { PrismaClient } from "@prisma/client";

export async function seedWebsiteProfiles(prisma: PrismaClient) {
  console.log("🔗 Seeding website profiles...");

  await prisma.websiteProfile.createMany({
    data: [
      {
        id: "wp_artist1_youtube",
        url: "https://youtube.com/luna-echo",
        websiteTypeId: "wt_youtube",
        profileId: "profile_artist1",
      },
      {
        id: "wp_artist1_twitter",
        url: "https://twitter.com/lunaecho",
        websiteTypeId: "wt_twitter",
        profileId: "profile_artist1",
      },
      {
        id: "wp_artist2_youtube",
        url: "https://youtube.com/novabeats",
        websiteTypeId: "wt_youtube",
        profileId: "profile_artist2",
      },
    ],
    skipDuplicates: true,
  });
}

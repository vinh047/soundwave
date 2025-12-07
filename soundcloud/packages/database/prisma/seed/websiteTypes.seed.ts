import { PrismaClient } from "@prisma/client";

export async function seedWebsiteTypes(prisma: PrismaClient) {
  console.log("🌐 Seeding website types...");

  await prisma.websiteType.createMany({
    data: [
      { id: "wt_youtube", type: "YOUTUBE", icon: "FaYoutube" },
      { id: "wt_facebook", type: "FACEBOOK", icon: "FaFacebook" },
      { id: "wt_twitter", type: "TWITTER", icon: "FaTwitter" },
      { id: "wt_tiktok", type: "TIKTOK", icon: "FaTiktok" },
    ],
    skipDuplicates: true,
  });
}

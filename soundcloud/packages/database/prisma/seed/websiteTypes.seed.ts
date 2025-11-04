import { PrismaClient } from "@prisma/client";

export async function seedWebsiteTypes(prisma: PrismaClient) {
  console.log("🌐 Seeding website types...");

  await prisma.websiteType.createMany({
    data: [
      { type: "YOUTUBE", icon: "FaYoutube" },
      { type: "TWITTER", icon: "FaTwitter" },
      { type: "INSTAGRAM", icon: "FaInstagram" },
      { type: "TIKTOK", icon: "FaTiktok" },
    ],
    skipDuplicates: true,
  });
}

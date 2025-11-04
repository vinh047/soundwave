import { PrismaClient } from "@prisma/client";
import { seedUsers } from "./users.seed";
import { seedWebsiteTypes } from "./websiteTypes.seed";
import { seedTracks } from "./tracks.seed";
import { seedPlaylists } from "./playlists.seed";
import { seedReportReasons } from "./reportReasons.seed";
import { seedProfiles } from "./profiles.seed";


const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seeding process...");

  await seedUsers(prisma);
  await seedProfiles(prisma);
  await seedWebsiteTypes(prisma);
  await seedTracks(prisma);
  await seedPlaylists(prisma);
  await seedReportReasons(prisma);

  console.log("Seeding complete!");
}

main()
  .catch((e) => { 
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

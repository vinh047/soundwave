import { PrismaClient, Role } from "@prisma/client";

export async function seedUsers(prisma: PrismaClient) {
  console.log("👤 Seeding users...");

  // 1. Upsert Admin User to ensure password/role is set
  await prisma.user.upsert({
    where: { email: "admin@soundwave.com" },
    update: {
      hashedPassword:
        "$2b$10$JI0tw9aufWF6pGRKc0rpTuJ2Cf7MdOYUrMrB9JJYxRdVGM7TnZ9zQW", // admin123
      role: Role.ADMIN,
    },
    create: {
      id: "user_admin",
      name: "Admin",
      email: "admin@soundwave.com",
      role: Role.ADMIN,
      hashedPassword:
        "$2b$10$JI0tw9aufWF6pGRKc0rpTuJ2Cf7MdOYUrMrB9JJYxRdVGM7TnZ9zQW", // admin123
    },
  });

  // 2. Create other users if not exist
  await prisma.user.createMany({
    data: [
      {
        id: "user_artist1",
        name: "Luna Echo",
        email: "luna@soundwave.com",
      },
      {
        id: "user_artist2",
        name: "Nova Beats",
        email: "nova@soundwave.com",
      },
      {
        id: "user_fan1",
        name: "Aria Listener",
        email: "aria@soundwave.com",
      },
    ],
    skipDuplicates: true,
  });
}

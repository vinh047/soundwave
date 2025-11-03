import { PrismaClient, Role } from "@prisma/client";

export async function seedUsers(prisma: PrismaClient) {
  console.log("👤 Seeding users...");

  await prisma.user.createMany({
    data: [
      {
        id: "user_admin",
        name: "Admin",
        email: "admin@soundwave.com",
        role: Role.ADMIN,
      },
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

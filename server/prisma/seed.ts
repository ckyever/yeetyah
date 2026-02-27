import { prisma } from "../lib/prisma";

async function main() {
  const guestUser = await prisma.user.upsert({
    where: { username: "guest" },
    update: {},
    create: {
      username: "guest",
      password: "hunter2",
      display_name: "Guest Account",
    },
  });
  console.log(`Seeded guest user: ${guestUser}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

import prisma from "./client";

import type { User } from "@prisma/client";

const DEFAULT_USERS = [
  // Add your own user to pre-populate the database with
  {
    username: "Ankit Waware",
    displayName: "Anki",
    email: "ankit@gmail.com",
  },
  {
    username: "Tim Apple",
    displayName: "Tim Apple",
    email: "tim@apple.com",
  },
] as Array<Partial<User>>;

(async () => {
  try {
    await Promise.all(
      DEFAULT_USERS.map((user) =>
        prisma.user.upsert({
          where: {
            username: user.username,
          },
          update: {
            ...user,
          },
          create: {
            username: user.username!,
            displayName: user.displayName!,
            email: user.email,
          },
        })
      )
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();

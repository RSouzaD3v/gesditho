import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const password = "123456"; // senha inicial
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email: "rafael@example.com" },
    update: {},
    create: {
      email: "rafael@example.com",
      name: "Rafael",
      password: hashedPassword,
      emailVerified: new Date(),
    },
  });

  console.log("Usuário criado ou atualizado:", user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { Role } from "../generated/prisma/enums";
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const hashedPassword = await bcrypt.hash("Admin@123456", 12);

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@gmail.com",
    },
    update: {
      role: Role.ADMIN,
      password: hashedPassword,
      status: "ACTIVE",
    },
    create: {
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: Role.ADMIN,
      status: "ACTIVE",
    },
  });

  console.log("Admin user created successfully:");
  console.log({
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

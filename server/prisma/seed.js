import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@company.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    await prisma.user.create({
      data: {
        name: 'System Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log(`✅ Default Admin created: ${adminEmail} (password loaded from .env)`);
  } else {
    console.log('ℹ️ Default Admin already exists.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

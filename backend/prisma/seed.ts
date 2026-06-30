import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const BCRYPT_ROUNDS = 12;

// The only bootstrap data a real deployment needs: the three roles and a single
// Owner account to log in with. Everything else (shops, brands, products,
// users, sales) is created through the app. No demo/sample data.
const OWNER_EMAIL = process.env.SEED_OWNER_EMAIL || 'owner@vapeshop.com';
const OWNER_PASSWORD = process.env.SEED_OWNER_PASSWORD || 'ChangeMe123!';

async function main() {
  console.log('🌱 Starting database seed (clean bootstrap)...');

  // 1. Roles -----------------------------------------------------------------
  const ownerRole = await prisma.role.upsert({
    where: { name: 'Owner' },
    update: {},
    create: {
      name: 'Owner',
      description: 'Full system access',
      permissions: {
        users: ['create', 'read', 'update', 'delete'],
        branches: ['create', 'read', 'update', 'delete'],
        catalog: ['create', 'read', 'update', 'delete'],
        sales: ['create', 'read', 'approve'],
        reports: ['read'],
      },
    },
  });

  await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: {
      name: 'Admin',
      description: 'Administrative access (cannot delete Owners)',
      permissions: {
        users: ['create', 'read', 'update'],
        branches: ['create', 'read', 'update', 'delete'],
        catalog: ['create', 'read', 'update', 'delete'],
        sales: ['create', 'read', 'approve'],
        reports: ['read'],
      },
    },
  });

  await prisma.role.upsert({
    where: { name: 'Staff' },
    update: {},
    create: {
      name: 'Staff',
      description: 'Branch-scoped sales access',
      permissions: { catalog: ['read'], sales: ['create', 'read'] },
    },
  });

  console.log('✅ Roles ready');

  // 2. Owner account ---------------------------------------------------------
  const passwordHash = await bcrypt.hash(OWNER_PASSWORD, BCRYPT_ROUNDS);

  await prisma.user.upsert({
    where: { email: OWNER_EMAIL },
    update: {},
    create: {
      email: OWNER_EMAIL,
      passwordHash,
      firstName: 'System',
      lastName: 'Owner',
      roleId: ownerRole.id,
      mustChangePassword: true,
    },
  });

  console.log('✅ Owner account ready');
  console.log('🎉 Seed complete. Log in and build out your shops, brands, products and users.');
  console.log('');
  console.log(`   Owner login: ${OWNER_EMAIL} / ${OWNER_PASSWORD}`);
  console.log('   ⚠️  Change this password immediately after first login.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

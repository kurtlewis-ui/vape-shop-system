import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const BCRYPT_ROUNDS = 12;
const DEFAULT_PASSWORD = 'ChangeMe123!';

async function main() {
  console.log('🌱 Starting database seed...');

  // ----------------------------------------------------------------------
  // 1. ROLES (Owner, Admin, Staff)
  // ----------------------------------------------------------------------
  console.log('Creating roles...');

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

  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: {
      name: 'Admin',
      description: 'Administrative access (same as Owner except cannot delete other Owners)',
      permissions: {
        users: ['create', 'read', 'update'],
        branches: ['create', 'read', 'update', 'delete'],
        catalog: ['create', 'read', 'update', 'delete'],
        sales: ['create', 'read', 'approve'],
        reports: ['read'],
      },
    },
  });

  const staffRole = await prisma.role.upsert({
    where: { name: 'Staff' },
    update: {},
    create: {
      name: 'Staff',
      description: 'Branch-scoped sales access',
      permissions: {
        catalog: ['read'],
        sales: ['create', 'read'],
      },
    },
  });

  console.log('✅ Roles created');

  // ----------------------------------------------------------------------
  // 2. DEFAULT BRANCH
  // ----------------------------------------------------------------------
  console.log('Creating default branch...');

  const mainBranch = await prisma.branch.upsert({
    where: { name: 'Main Store' },
    update: {},
    create: {
      name: 'Main Store',
      address: 'Default branch — rename or delete and create your own.',
    },
  });

  console.log('✅ Default branch created');

  // ----------------------------------------------------------------------
  // 3. DEFAULT USERS
  // ----------------------------------------------------------------------
  console.log('Creating default users...');

  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, BCRYPT_ROUNDS);

  await prisma.user.upsert({
    where: { email: 'owner@vapeshop.com' },
    update: {},
    create: {
      email: 'owner@vapeshop.com',
      passwordHash,
      firstName: 'System',
      lastName: 'Owner',
      roleId: ownerRole.id,
      mustChangePassword: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@vapeshop.com' },
    update: {},
    create: {
      email: 'admin@vapeshop.com',
      passwordHash,
      firstName: 'Store',
      lastName: 'Admin',
      roleId: adminRole.id,
      mustChangePassword: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'staff@vapeshop.com' },
    update: { branchId: mainBranch.id },
    create: {
      email: 'staff@vapeshop.com',
      passwordHash,
      firstName: 'Store',
      lastName: 'Staff',
      roleId: staffRole.id,
      branchId: mainBranch.id,
      mustChangePassword: true,
    },
  });

  console.log('✅ Default users created');

  // ----------------------------------------------------------------------
  // 4. SAMPLE CATALOG (brands + products + per-branch stock)
  // ----------------------------------------------------------------------
  console.log('Creating sample brands and products...');

  const slugify = (s: string) =>
    s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

  const brandData = [
    { name: 'Elf Bar' },
    { name: 'Lost Mary' },
    { name: 'Funky Republic' },
  ];

  const brands: Record<string, string> = {};
  for (const b of brandData) {
    const existing = await prisma.brand.findFirst({ where: { name: b.name } });
    const brand =
      existing ??
      (await prisma.brand.create({
        data: { name: b.name, slug: slugify(b.name) },
      }));
    brands[b.name] = brand.id;
  }

  const productData = [
    { name: 'Blue Razz Ice 5000', brand: 'Elf Bar', price: 450, qty: 30, alert: 5 },
    { name: 'Watermelon Ice 5000', brand: 'Elf Bar', price: 450, qty: 25, alert: 5 },
    { name: 'Mango Tango 3000', brand: 'Lost Mary', price: 380, qty: 40, alert: 8 },
    { name: 'Grape Ice 5000', brand: 'Lost Mary', price: 400, qty: 18, alert: 5 },
    { name: 'Strawberry Banana', brand: 'Funky Republic', price: 520, qty: 12, alert: 3 },
  ];

  for (const p of productData) {
    const exists = await prisma.product.findFirst({ where: { name: p.name } });
    if (exists) continue;
    await prisma.product.create({
      data: {
        name: p.name,
        slug: slugify(p.name),
        brandId: brands[p.brand],
        sellingPrice: p.price,
        quantityAlert: p.alert,
        inventory: { create: [{ branchId: mainBranch.id, quantity: p.qty }] },
      },
    });
  }

  console.log('✅ Sample brands and products created');

  console.log('🎉 Database seed completed successfully!');
  console.log('');
  console.log('Default login credentials:');
  console.log('  Owner: owner@vapeshop.com / ChangeMe123!');
  console.log('  Admin: admin@vapeshop.com / ChangeMe123!');
  console.log('  Staff: staff@vapeshop.com / ChangeMe123! (assigned to "Main Store")');
  console.log('');
  console.log('⚠️  IMPORTANT: Change these passwords immediately!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

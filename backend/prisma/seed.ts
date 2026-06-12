import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const BCRYPT_ROUNDS = 12;
const DEFAULT_PASSWORD = 'ChangeMe123!';

async function main() {
  console.log('🌱 Starting database seed...');

  // ----------------------------------------------------------------------
  // 1. ROLES
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
        products: ['create', 'read', 'update', 'delete'],
        inventory: ['create', 'read', 'update', 'delete'],
        sales: ['create', 'read', 'update', 'void', 'refund'],
        reports: ['read', 'export'],
        settings: ['read', 'update'],
        auditLogs: ['read'],
      },
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: {
      name: 'Admin',
      description: 'Administrative access',
      permissions: {
        users: ['create', 'read', 'update'],
        products: ['create', 'read', 'update', 'delete'],
        inventory: ['create', 'read', 'update'],
        sales: ['create', 'read', 'update', 'void'],
        reports: ['read', 'export'],
      },
    },
  });

  const staffRole = await prisma.role.upsert({
    where: { name: 'Staff' },
    update: {},
    create: {
      name: 'Staff',
      description: 'Basic staff access',
      permissions: {
        products: ['read'],
        inventory: ['read', 'receive'],
        sales: ['create', 'read'],
      },
    },
  });

  console.log('✅ Roles created');

  // ----------------------------------------------------------------------
  // 2. DEFAULT USERS
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
    update: {},
    create: {
      email: 'staff@vapeshop.com',
      passwordHash,
      firstName: 'Store',
      lastName: 'Staff',
      roleId: staffRole.id,
      mustChangePassword: true,
    },
  });

  console.log('✅ Default users created');

  // ----------------------------------------------------------------------
  // 3. PAYMENT METHODS
  // ----------------------------------------------------------------------
  console.log('Creating payment methods...');

  const paymentMethods = [
    { name: 'Cash', type: 'CASH' },
    { name: 'Credit Card', type: 'CARD' },
    { name: 'Debit Card', type: 'CARD' },
    { name: 'Digital Wallet', type: 'DIGITAL' },
  ];

  for (const pm of paymentMethods) {
    await prisma.paymentMethod.upsert({
      where: { name: pm.name },
      update: {},
      create: pm,
    });
  }

  console.log('✅ Payment methods created');

  // ----------------------------------------------------------------------
  // 4. CATEGORIES
  // ----------------------------------------------------------------------
  console.log('Creating categories...');

  const categories = [
    { name: 'E-Liquids', slug: 'e-liquids', displayOrder: 1 },
    { name: 'Devices', slug: 'devices', displayOrder: 2 },
    { name: 'Pods & Cartridges', slug: 'pods-cartridges', displayOrder: 3 },
    { name: 'Coils', slug: 'coils', displayOrder: 4 },
    { name: 'Accessories', slug: 'accessories', displayOrder: 5 },
    { name: 'Disposables', slug: 'disposables', displayOrder: 6 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log('✅ Categories created');

  // ----------------------------------------------------------------------
  // 5. SYSTEM SETTINGS
  // ----------------------------------------------------------------------
  console.log('Creating system settings...');

  const settings = [
    { key: 'shop.name', value: 'My Vape Shop', dataType: 'STRING', category: 'general', isPublic: true },
    { key: 'shop.tax_rate', value: '8.5', dataType: 'NUMBER', category: 'general', isPublic: true },
    { key: 'shop.currency', value: 'USD', dataType: 'STRING', category: 'general', isPublic: true },
    { key: 'shop.minimum_age', value: '21', dataType: 'NUMBER', category: 'compliance', isPublic: true },
    { key: 'inventory.low_stock_threshold', value: '10', dataType: 'NUMBER', category: 'inventory', isPublic: false },
    { key: 'security.session_timeout', value: '900', dataType: 'NUMBER', category: 'security', isPublic: false },
    { key: 'security.max_login_attempts', value: '5', dataType: 'NUMBER', category: 'security', isPublic: false },
  ];

  for (const setting of settings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log('✅ System settings created');

  console.log('🎉 Database seed completed successfully!');
  console.log('');
  console.log('Default login credentials:');
  console.log('  Owner: owner@vapeshop.com / ChangeMe123!');
  console.log('  Admin: admin@vapeshop.com / ChangeMe123!');
  console.log('  Staff: staff@vapeshop.com / ChangeMe123!');
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

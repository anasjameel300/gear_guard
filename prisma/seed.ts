import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../lib/generated/prisma';
import bcrypt from 'bcryptjs';

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create the Prisma adapter
const adapter = new PrismaPg(pool);

// Create PrismaClient with the pg adapter
const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log('🌱 Starting database seed...\n');

  // ============================================
  // 1. SYSTEM OPTIONS (Categories, Departments, Locations)
  // ============================================
  console.log('📋 Creating system options...');

  const categories = ['Manufacturing', 'Heavy Machinery', 'IT', 'Vehicle', 'Facility', 'Medical'];
  const departments = ['Production', 'Office', 'Design', 'IT', 'Management', 'Maintenance', 'Logistics'];
  const locations = [
    'Production Floor A',
    'Production Floor B',
    'Zone B',
    'Office 304',
    'Server Room',
    'Warehouse',
    'Loading Dock',
  ];

  for (const value of categories) {
    await prisma.systemOption.upsert({
      where: { type_value: { type: 'category', value } },
      update: {},
      create: { type: 'category', value },
    });
  }

  for (const value of departments) {
    await prisma.systemOption.upsert({
      where: { type_value: { type: 'department', value } },
      update: {},
      create: { type: 'department', value },
    });
  }

  for (const value of locations) {
    await prisma.systemOption.upsert({
      where: { type_value: { type: 'location', value } },
      update: {},
      create: { type: 'location', value },
    });
  }

  console.log('  ✓ System options created\n');

  // ============================================
  // 2. USERS
  // ============================================
  console.log('👥 Creating users...');

  const passwordHash = await bcrypt.hash('admin123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@gearguard.com' },
    update: {},
    create: {
      email: 'admin@gearguard.com',
      passwordHash,
      name: 'Mitchell Admin',
      role: 'ADMIN',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mitchell',
      department: 'Management',
    },
  });

  const janeDoe = await prisma.user.upsert({
    where: { email: 'jane@gearguard.com' },
    update: {},
    create: {
      email: 'jane@gearguard.com',
      passwordHash,
      name: 'Jane Doe',
      role: 'TECHNICIAN',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
      department: 'Maintenance',
    },
  });

  const bobSmith = await prisma.user.upsert({
    where: { email: 'bob@gearguard.com' },
    update: {},
    create: {
      email: 'bob@gearguard.com',
      passwordHash,
      name: 'Bob Smith',
      role: 'TECHNICIAN',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
      department: 'Maintenance',
    },
  });

  const aliceCooper = await prisma.user.upsert({
    where: { email: 'alice@gearguard.com' },
    update: {},
    create: {
      email: 'alice@gearguard.com',
      passwordHash,
      name: 'Alice Cooper',
      role: 'TECHNICIAN',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
      department: 'IT Support',
    },
  });

  console.log('  ✓ Users created\n');

  // ============================================
  // 3. TEAMS
  // ============================================
  console.log('🔧 Creating maintenance teams...');

  const mechanicsTeam = await prisma.team.upsert({
    where: { id: 'team-mechanics' },
    update: {},
    create: {
      id: 'team-mechanics',
      name: 'Mechanics',
      description: 'Heavy machinery and hydraulics',
      leadTechnicianId: janeDoe.id,
    },
  });

  const electriciansTeam = await prisma.team.upsert({
    where: { id: 'team-electricians' },
    update: {},
    create: {
      id: 'team-electricians',
      name: 'Electricians',
      description: 'Power systems and wiring',
      leadTechnicianId: bobSmith.id,
    },
  });

  const itSupportTeam = await prisma.team.upsert({
    where: { id: 'team-it-support' },
    update: {},
    create: {
      id: 'team-it-support',
      name: 'IT Support',
      description: 'Computers, servers, and networks',
      leadTechnicianId: aliceCooper.id,
    },
  });

  // Add team members
  await prisma.teamMember.upsert({
    where: { teamId_userId: { teamId: mechanicsTeam.id, userId: janeDoe.id } },
    update: {},
    create: { teamId: mechanicsTeam.id, userId: janeDoe.id },
  });

  await prisma.teamMember.upsert({
    where: { teamId_userId: { teamId: electriciansTeam.id, userId: bobSmith.id } },
    update: {},
    create: { teamId: electriciansTeam.id, userId: bobSmith.id },
  });

  await prisma.teamMember.upsert({
    where: { teamId_userId: { teamId: itSupportTeam.id, userId: aliceCooper.id } },
    update: {},
    create: { teamId: itSupportTeam.id, userId: aliceCooper.id },
  });

  console.log('  ✓ Teams created\n');

  // ============================================
  // 4. EQUIPMENT
  // ============================================
  console.log('📦 Creating equipment...');

  const cncMachine = await prisma.equipment.upsert({
    where: { serialNumber: 'CNC-2023-X5' },
    update: {},
    create: {
      name: 'CNC Milling Machine X5',
      serialNumber: 'CNC-2023-X5',
      status: 'OPERATIONAL',
      location: 'Production Floor A',
      department: 'Production',
      category: 'Manufacturing',
      purchaseDate: new Date('2022-01-10'),
      warrantyExpiration: new Date('2025-01-10'),
      lastMaintenance: new Date('2023-10-15'),
      maintenanceTeamId: mechanicsTeam.id,
      technicianId: janeDoe.id,
    },
  });

  const hydraulicPress = await prisma.equipment.upsert({
    where: { serialNumber: 'HP-500-002' },
    update: {},
    create: {
      name: 'Hydraulic Press 500T',
      serialNumber: 'HP-500-002',
      status: 'MAINTENANCE',
      location: 'Zone B',
      department: 'Production',
      category: 'Heavy Machinery',
      purchaseDate: new Date('2021-05-20'),
      warrantyExpiration: new Date('2024-05-20'),
      lastMaintenance: new Date('2023-11-01'),
      maintenanceTeamId: mechanicsTeam.id,
      technicianId: janeDoe.id,
    },
  });

  const macbookPro = await prisma.equipment.upsert({
    where: { serialNumber: 'APL-MBP-99' },
    update: {},
    create: {
      name: 'MacBook Pro M2',
      serialNumber: 'APL-MBP-99',
      status: 'OPERATIONAL',
      location: 'Office 304',
      department: 'Design',
      category: 'IT',
      assignedTo: 'Sarah Designer',
      purchaseDate: new Date('2023-06-01'),
      warrantyExpiration: new Date('2024-06-01'),
      lastMaintenance: new Date('2023-09-20'),
      maintenanceTeamId: itSupportTeam.id,
      technicianId: aliceCooper.id,
    },
  });

  const serverRack = await prisma.equipment.upsert({
    where: { serialNumber: 'SRV-RACK-01' },
    update: {},
    create: {
      name: 'Main Server Rack',
      serialNumber: 'SRV-RACK-01',
      status: 'OPERATIONAL',
      location: 'Server Room',
      department: 'IT',
      category: 'IT',
      purchaseDate: new Date('2020-11-15'),
      warrantyExpiration: new Date('2023-11-15'),
      lastMaintenance: new Date('2023-10-28'),
      maintenanceTeamId: itSupportTeam.id,
      technicianId: aliceCooper.id,
    },
  });

  console.log('  ✓ Equipment created\n');

  // ============================================
  // 5. MAINTENANCE TICKETS
  // ============================================
  console.log('🎫 Creating maintenance tickets...');

  await prisma.maintenanceTicket.upsert({
    where: { id: 'ticket-001' },
    update: {},
    create: {
      id: 'ticket-001',
      title: 'Hydraulic Leak in Press',
      description: 'Oil leaking from main cylinder seal. Requires immediate attention.',
      status: 'NEW',
      priority: 'HIGH',
      type: 'CORRECTIVE',
      equipmentId: hydraulicPress.id,
      scheduledDate: new Date('2023-11-07'),
    },
  });

  await prisma.maintenanceTicket.upsert({
    where: { id: 'ticket-002' },
    update: {},
    create: {
      id: 'ticket-002',
      title: 'OS Update & Security Patch',
      description: 'Annual security software update required for compliance.',
      status: 'NEW',
      priority: 'MEDIUM',
      type: 'PREVENTIVE',
      equipmentId: macbookPro.id,
      scheduledDate: new Date('2023-11-10'),
    },
  });

  await prisma.maintenanceTicket.upsert({
    where: { id: 'ticket-003' },
    update: {},
    create: {
      id: 'ticket-003',
      title: 'Monthly Calibration',
      description: 'Routine axis calibration for precision manufacturing.',
      status: 'IN_PROGRESS',
      priority: 'LOW',
      type: 'PREVENTIVE',
      equipmentId: cncMachine.id,
      assignedToId: janeDoe.id,
      scheduledDate: new Date('2023-11-02'),
    },
  });

  console.log('  ✓ Maintenance tickets created\n');

  // ============================================
  // 6. ACTIVITY LOG
  // ============================================
  console.log('📝 Creating activity log...');

  await prisma.activityLog.create({
    data: {
      type: 'EQUIPMENT_ADDED',
      message: 'System initialized with demo data',
      userId: adminUser.id,
    },
  });

  await prisma.activityLog.create({
    data: {
      type: 'TICKET_CREATED',
      message: 'Created maintenance ticket for Hydraulic Press 500T',
      entityType: 'ticket',
      entityId: 'ticket-001',
      userId: adminUser.id,
    },
  });

  await prisma.activityLog.create({
    data: {
      type: 'TEAM_CREATED',
      message: 'Created new team: Mechanics',
      entityType: 'team',
      entityId: mechanicsTeam.id,
      userId: adminUser.id,
    },
  });

  console.log('  ✓ Activity log created\n');

  console.log('✅ Database seeded successfully!\n');
  console.log('📧 Demo Login Credentials:');
  console.log('   Email: admin@gearguard.com');
  console.log('   Password: admin123\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


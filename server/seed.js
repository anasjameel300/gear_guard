import pool from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default password for all demo users
const DEFAULT_PASSWORD = 'password123';

// ==================== USERS ====================
const USERS = [
    { id: 'u1', name: 'Anas Jameel', email: 'anas@gearguard.com', role: 'admin', department: 'Management' },
    { id: 'u2', name: 'Aryan Swain', email: 'aryan@gearguard.com', role: 'technician', department: 'Maintenance' },
    { id: 'u3', name: 'Asif Hasan', email: 'asif@gearguard.com', role: 'technician', department: 'IT Support' },
    { id: 'u4', name: 'Rudransh Jena', email: 'rudransh@gearguard.com', role: 'technician', department: 'Production' },
];

// ==================== TEAMS ====================
const TEAMS = [
    { id: 'mt1', name: 'Mechanical Team', description: 'Heavy machinery, hydraulics, and production equipment', leadTechnicianId: 'u2', memberIds: ['u2', 'u4'] },
    { id: 'mt2', name: 'IT Infrastructure', description: 'Servers, networks, computers, and software systems', leadTechnicianId: 'u3', memberIds: ['u3'] },
    { id: 'mt3', name: 'Facility Operations', description: 'HVAC, electrical, plumbing, and building systems', leadTechnicianId: 'u4', memberIds: ['u4', 'u2'] },
];

// ==================== EQUIPMENT (10 items) ====================
const EQUIPMENT = [
    // Manufacturing/Production
    { id: 'eq1', name: 'CNC Milling Machine Alpha', serialNumber: 'CNC-2022-A01', location: 'Production Floor A', status: 'operational', lastMaintenance: '2025-12-15', category: 'Manufacturing', department: 'Production', maintenanceTeamId: 'mt1', technicianId: 'u2', purchaseDate: '2022-01-10', warrantyExpiration: '2026-01-10' },
    { id: 'eq2', name: 'Hydraulic Press 500T', serialNumber: 'HP-500-002', location: 'Production Floor A', status: 'maintenance', lastMaintenance: '2025-11-01', category: 'Heavy Machinery', department: 'Production', maintenanceTeamId: 'mt1', technicianId: 'u4', purchaseDate: '2021-05-20', warrantyExpiration: '2026-05-20' },
    { id: 'eq3', name: 'Lathe Machine LM-200', serialNumber: 'LTH-2023-200', location: 'Production Floor B', status: 'operational', lastMaintenance: '2025-12-20', category: 'Manufacturing', department: 'Production', maintenanceTeamId: 'mt1', technicianId: 'u2', purchaseDate: '2023-03-15', warrantyExpiration: '2027-03-15' },

    // IT Equipment
    { id: 'eq4', name: 'Dell PowerEdge R740 Server', serialNumber: 'DELL-SRV-001', location: 'Server Room', status: 'operational', lastMaintenance: '2025-12-10', category: 'IT', department: 'IT', maintenanceTeamId: 'mt2', technicianId: 'u3', purchaseDate: '2023-06-01', warrantyExpiration: '2027-06-01' },
    { id: 'eq5', name: 'Network Switch Cisco 3850', serialNumber: 'CSC-NSW-3850', location: 'Server Room', status: 'operational', lastMaintenance: '2025-11-25', category: 'IT', department: 'IT', maintenanceTeamId: 'mt2', technicianId: 'u3', purchaseDate: '2022-08-10', warrantyExpiration: '2026-08-10' },
    { id: 'eq6', name: 'UPS APC Smart-UPS 3000', serialNumber: 'APC-UPS-3K', location: 'Server Room', status: 'operational', lastMaintenance: '2025-12-01', category: 'IT', department: 'IT', maintenanceTeamId: 'mt2', technicianId: 'u3', purchaseDate: '2021-11-20', warrantyExpiration: '2026-11-20' },

    // Vehicles & Logistics
    { id: 'eq7', name: 'Forklift Toyota 8FGU25', serialNumber: 'TYT-FKL-25', location: 'Warehouse', status: 'operational', lastMaintenance: '2025-12-18', category: 'Vehicle', department: 'Logistics', maintenanceTeamId: 'mt3', technicianId: 'u4', purchaseDate: '2020-11-15', warrantyExpiration: '2026-11-15' },
    { id: 'eq8', name: 'Pallet Jack Electric', serialNumber: 'PJE-2023-01', location: 'Warehouse', status: 'down', lastMaintenance: '2025-10-05', category: 'Vehicle', department: 'Logistics', maintenanceTeamId: 'mt3', technicianId: 'u4', purchaseDate: '2023-02-28', warrantyExpiration: '2027-02-28' },

    // Facility
    { id: 'eq9', name: 'Industrial AC Unit - Zone A', serialNumber: 'AC-IND-001', location: 'Production Floor A', status: 'operational', lastMaintenance: '2025-12-22', category: 'Facility', department: 'Maintenance', maintenanceTeamId: 'mt3', technicianId: 'u2', purchaseDate: '2022-03-15', warrantyExpiration: '2028-03-15' },
    { id: 'eq10', name: 'Industrial AC Unit - Zone B', serialNumber: 'AC-IND-002', location: 'Production Floor B', status: 'maintenance', lastMaintenance: '2025-11-10', category: 'Facility', department: 'Maintenance', maintenanceTeamId: 'mt3', technicianId: 'u2', purchaseDate: '2022-03-15', warrantyExpiration: '2028-03-15' },
];

// ==================== MAINTENANCE TICKETS (15 tickets) ====================
const TICKETS = [
    // NEW tickets (3)
    { id: 't1', title: 'Hydraulic Leak - Main Cylinder', equipmentId: 'eq2', equipmentName: 'Hydraulic Press 500T', priority: 'high', status: 'new', type: 'corrective', dateCreated: '2025-12-26', description: 'Oil leaking from main cylinder seal. Production halted until repair.', scheduledDate: '2025-12-28' },
    { id: 't2', title: 'AC Unit Filter Replacement', equipmentId: 'eq10', equipmentName: 'Industrial AC Unit - Zone B', priority: 'medium', status: 'new', type: 'preventive', dateCreated: '2025-12-27', description: 'Scheduled quarterly filter replacement for Zone B AC unit.', scheduledDate: '2025-12-30' },
    { id: 't3', title: 'Forklift Annual Inspection', equipmentId: 'eq7', equipmentName: 'Forklift Toyota 8FGU25', priority: 'low', status: 'new', type: 'preventive', dateCreated: '2025-12-27', description: 'Annual safety inspection and certification renewal required.', scheduledDate: '2026-01-05' },

    // IN-PROGRESS tickets (4)
    { id: 't4', title: 'Server Backup System Configuration', equipmentId: 'eq4', equipmentName: 'Dell PowerEdge R740 Server', priority: 'high', status: 'in-progress', type: 'preventive', assigneeId: 'u3', dateCreated: '2025-12-20', description: 'Configure automated backup system and disaster recovery procedures.', scheduledDate: '2025-12-28' },
    { id: 't5', title: 'CNC Machine Calibration', equipmentId: 'eq1', equipmentName: 'CNC Milling Machine Alpha', priority: 'medium', status: 'in-progress', type: 'preventive', assigneeId: 'u2', dateCreated: '2025-12-22', description: 'Monthly precision calibration of all axes.', scheduledDate: '2025-12-27' },
    { id: 't6', title: 'Pallet Jack Motor Repair', equipmentId: 'eq8', equipmentName: 'Pallet Jack Electric', priority: 'high', status: 'in-progress', type: 'corrective', assigneeId: 'u4', dateCreated: '2025-12-24', description: 'Electric motor making unusual noise. Suspected bearing failure.', scheduledDate: '2025-12-27' },
    { id: 't7', title: 'Network Switch Firmware Update', equipmentId: 'eq5', equipmentName: 'Network Switch Cisco 3850', priority: 'medium', status: 'in-progress', type: 'preventive', assigneeId: 'u3', dateCreated: '2025-12-25', description: 'Critical security patches need to be applied during maintenance window.', scheduledDate: '2025-12-28' },

    // ON-HOLD tickets (2)
    { id: 't8', title: 'Lathe Spindle Bearing Replacement', equipmentId: 'eq3', equipmentName: 'Lathe Machine LM-200', priority: 'medium', status: 'on-hold', type: 'corrective', assigneeId: 'u2', dateCreated: '2025-12-18', description: 'Awaiting replacement parts from supplier. Expected delivery Jan 3rd.', scheduledDate: '2026-01-05' },
    { id: 't9', title: 'UPS Battery Bank Replacement', equipmentId: 'eq6', equipmentName: 'UPS APC Smart-UPS 3000', priority: 'high', status: 'on-hold', type: 'corrective', assigneeId: 'u3', dateCreated: '2025-12-15', description: 'Battery capacity at 60%. Waiting for budget approval to proceed.', scheduledDate: '2026-01-10' },

    // COMPLETED tickets (6)
    { id: 't10', title: 'CNC Monthly Maintenance', equipmentId: 'eq1', equipmentName: 'CNC Milling Machine Alpha', priority: 'low', status: 'completed', type: 'preventive', assigneeId: 'u2', dateCreated: '2025-12-10', description: 'Routine lubrication and cleaning completed.', scheduledDate: '2025-12-15' },
    { id: 't11', title: 'Server Room HVAC Check', equipmentId: 'eq4', equipmentName: 'Dell PowerEdge R740 Server', priority: 'medium', status: 'completed', type: 'preventive', assigneeId: 'u3', dateCreated: '2025-12-05', description: 'Verified cooling system efficiency and airflow patterns.', scheduledDate: '2025-12-10' },
    { id: 't12', title: 'Forklift Brake Adjustment', equipmentId: 'eq7', equipmentName: 'Forklift Toyota 8FGU25', priority: 'high', status: 'completed', type: 'corrective', assigneeId: 'u4', dateCreated: '2025-12-12', description: 'Adjusted brake system after operator reported soft pedal feel.', scheduledDate: '2025-12-18' },
    { id: 't13', title: 'AC Unit Compressor Service', equipmentId: 'eq9', equipmentName: 'Industrial AC Unit - Zone A', priority: 'medium', status: 'completed', type: 'preventive', assigneeId: 'u2', dateCreated: '2025-12-18', description: 'Quarterly compressor inspection and refrigerant level check.', scheduledDate: '2025-12-22' },
    { id: 't14', title: 'Network Performance Audit', equipmentId: 'eq5', equipmentName: 'Network Switch Cisco 3850', priority: 'low', status: 'completed', type: 'preventive', assigneeId: 'u3', dateCreated: '2025-11-20', description: 'Analyzed traffic patterns and optimized VLAN configurations.', scheduledDate: '2025-11-25' },
    { id: 't15', title: 'Hydraulic Press Safety Check', equipmentId: 'eq2', equipmentName: 'Hydraulic Press 500T', priority: 'high', status: 'completed', type: 'preventive', assigneeId: 'u4', dateCreated: '2025-10-25', description: 'Annual safety inspection. All safety systems passed.', scheduledDate: '2025-11-01' },
];

// ==================== SYSTEM OPTIONS ====================
const SYSTEM_OPTIONS = {
    categories: ['Manufacturing', 'Heavy Machinery', 'IT', 'Vehicle', 'Facility', 'Medical', 'Electrical', 'Safety'],
    departments: ['Production', 'Office', 'Design', 'IT', 'Management', 'Maintenance', 'Logistics', 'Quality', 'HR'],
    locations: ['Production Floor A', 'Production Floor B', 'Zone B', 'Office Block', 'Server Room', 'Warehouse', 'Loading Dock', 'Parking Area', 'Reception'],
};

// ==================== ACTIVITIES (Recent activity log) ====================
const ACTIVITIES = [
    { id: 'a1', type: 'system', message: 'System initialized with production data', user: 'System', timestamp: '2025-12-20T09:00:00Z' },
    { id: 'a2', type: 'ticket_created', message: 'Created high priority ticket: Hydraulic Leak - Main Cylinder', user: 'Anas Jameel', timestamp: '2025-12-26T14:30:00Z' },
    { id: 'a3', type: 'ticket_status_change', message: 'Started work on: Server Backup System Configuration', user: 'Asif Hasan', timestamp: '2025-12-20T10:15:00Z' },
    { id: 'a4', type: 'ticket_status_change', message: 'Completed: CNC Monthly Maintenance', user: 'Aryan Swain', timestamp: '2025-12-15T16:45:00Z' },
    { id: 'a5', type: 'equipment_updated', message: 'Updated equipment status: Pallet Jack Electric marked as DOWN', user: 'Rudransh Jena', timestamp: '2025-12-24T11:20:00Z' },
    { id: 'a6', type: 'ticket_created', message: 'Created ticket: Pallet Jack Motor Repair', user: 'Rudransh Jena', timestamp: '2025-12-24T11:25:00Z' },
    { id: 'a7', type: 'ticket_status_change', message: 'Completed: Forklift Brake Adjustment', user: 'Rudransh Jena', timestamp: '2025-12-18T17:00:00Z' },
    { id: 'a8', type: 'ticket_status_change', message: 'Put on hold: Lathe Spindle Bearing Replacement (waiting for parts)', user: 'Aryan Swain', timestamp: '2025-12-19T09:30:00Z' },
    { id: 'a9', type: 'equipment_added', message: 'Added new equipment: Network Switch Cisco 3850', user: 'Asif Hasan', timestamp: '2025-12-01T10:00:00Z' },
    { id: 'a10', type: 'ticket_created', message: 'Created ticket: AC Unit Filter Replacement', user: 'Anas Jameel', timestamp: '2025-12-27T08:00:00Z' },
    { id: 'a11', type: 'ticket_status_change', message: 'Started work on: CNC Machine Calibration', user: 'Aryan Swain', timestamp: '2025-12-22T14:00:00Z' },
    { id: 'a12', type: 'ticket_status_change', message: 'Completed: Server Room HVAC Check', user: 'Asif Hasan', timestamp: '2025-12-10T15:30:00Z' },
];

async function seed() {
    const client = await pool.connect();

    try {
        console.log('🌱 Starting database seeding with comprehensive data...');

        // Migration: Add password_hash column if it doesn't exist
        await client.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='password_hash') THEN
                    ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);
                END IF;
            END $$;
        `);
        console.log('✅ Migration check complete');

        // Read and execute schema
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        await client.query(schema);
        console.log('✅ Schema created/updated');

        // Clear existing data (in reverse order of dependencies)
        await client.query('DELETE FROM activities');
        await client.query('DELETE FROM tickets');
        await client.query('DELETE FROM equipment');
        await client.query('DELETE FROM team_members');
        await client.query('DELETE FROM teams');
        await client.query('DELETE FROM users');
        await client.query('DELETE FROM system_options');
        console.log('🗑️ Cleared existing data');

        // Hash the default password
        const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

        // Insert Users
        for (const user of USERS) {
            const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff`;
            await client.query(
                'INSERT INTO users (id, name, email, password_hash, role, avatar_url, department) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                [user.id, user.name, user.email, passwordHash, user.role, avatarUrl, user.department]
            );
        }
        console.log(`✅ Inserted ${USERS.length} users`);

        // Insert Teams
        for (const team of TEAMS) {
            await client.query(
                'INSERT INTO teams (id, name, description, lead_technician_id) VALUES ($1, $2, $3, $4)',
                [team.id, team.name, team.description, team.leadTechnicianId]
            );
            for (const memberId of team.memberIds) {
                await client.query(
                    'INSERT INTO team_members (team_id, user_id) VALUES ($1, $2)',
                    [team.id, memberId]
                );
            }
        }
        console.log(`✅ Inserted ${TEAMS.length} teams`);

        // Insert Equipment
        for (const equip of EQUIPMENT) {
            await client.query(
                `INSERT INTO equipment (id, name, serial_number, location, status, last_maintenance, category, department, assigned_to, maintenance_team_id, technician_id, purchase_date, warranty_expiration) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
                [equip.id, equip.name, equip.serialNumber, equip.location, equip.status, equip.lastMaintenance, equip.category, equip.department, equip.assignedTo || null, equip.maintenanceTeamId, equip.technicianId, equip.purchaseDate, equip.warrantyExpiration]
            );
        }
        console.log(`✅ Inserted ${EQUIPMENT.length} equipment items`);

        // Insert Tickets
        for (const ticket of TICKETS) {
            await client.query(
                `INSERT INTO tickets (id, title, equipment_id, equipment_name, priority, status, type, assignee_id, date_created, description, scheduled_date) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                [ticket.id, ticket.title, ticket.equipmentId, ticket.equipmentName, ticket.priority, ticket.status, ticket.type, ticket.assigneeId || null, ticket.dateCreated, ticket.description, ticket.scheduledDate]
            );
        }
        console.log(`✅ Inserted ${TICKETS.length} maintenance tickets`);

        // Insert System Options
        for (const [optionType, values] of Object.entries(SYSTEM_OPTIONS)) {
            for (const value of values) {
                await client.query(
                    'INSERT INTO system_options (option_type, option_value) VALUES ($1, $2)',
                    [optionType, value]
                );
            }
        }
        console.log('✅ Inserted system options');

        // Insert Activities with proper timestamps
        for (const activity of ACTIVITIES) {
            await client.query(
                'INSERT INTO activities (id, type, message, user_name, timestamp) VALUES ($1, $2, $3, $4, $5)',
                [activity.id, activity.type, activity.message, activity.user, activity.timestamp]
            );
        }
        console.log(`✅ Inserted ${ACTIVITIES.length} activity logs`);

        console.log('\n🎉 Database seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   - ${USERS.length} users`);
        console.log(`   - ${TEAMS.length} maintenance teams`);
        console.log(`   - ${EQUIPMENT.length} equipment items`);
        console.log(`   - ${TICKETS.length} maintenance tickets (3 new, 4 in-progress, 2 on-hold, 6 completed)`);
        console.log(`   - ${ACTIVITIES.length} activity logs`);
        console.log('\n📝 Demo Credentials:');
        console.log('   Admin: anas@gearguard.com / password123');
        console.log('   Technicians: aryan@gearguard.com, asif@gearguard.com, rudransh@gearguard.com');
        console.log(`   Password for all: ${DEFAULT_PASSWORD}`);
    } catch (err) {
        console.error('❌ Error seeding database:', err);
        throw err;
    } finally {
        client.release();
        await pool.end();
    }
}

seed();

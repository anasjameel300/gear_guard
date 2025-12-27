import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import pool from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ==================== UTILITY FUNCTIONS ====================

const generateId = () => Math.random().toString(36).substr(2, 9);

// ==================== API ROUTES ====================

// Health check
app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'ok', database: 'connected' });
    } catch (err) {
        res.status(500).json({ status: 'error', database: 'disconnected', error: err.message });
    }
});

// ==================== AUTHENTICATION ====================

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const result = await pool.query(
            'SELECT id, name, email, password_hash, role, avatar_url as "avatarUrl", department FROM users WHERE email = $1',
            [email.toLowerCase()]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = result.rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Remove password_hash from response
        const { password_hash, ...userWithoutPassword } = user;

        res.json({
            success: true,
            user: userWithoutPassword
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
});

app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, role, department } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        // Check if user already exists
        const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const id = generateId();
        const passwordHash = await bcrypt.hash(password, 10);
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;

        await pool.query(
            'INSERT INTO users (id, name, email, password_hash, role, avatar_url, department) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [id, name, email.toLowerCase(), passwordHash, role || 'technician', avatarUrl, department || null]
        );

        res.json({
            success: true,
            user: { id, name, email: email.toLowerCase(), role: role || 'technician', avatarUrl, department }
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// ==================== USERS ====================

app.get('/api/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, email, role, avatar_url as "avatarUrl", department FROM users');
        // Convert to object format like the frontend expects
        const usersObj = {};
        result.rows.forEach(user => {
            usersObj[user.id] = user;
        });
        res.json(usersObj);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/users', async (req, res) => {
    try {
        const { name, email, role, department } = req.body;
        const id = generateId();
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

        await pool.query(
            'INSERT INTO users (id, name, email, role, avatar_url, department) VALUES ($1, $2, $3, $4, $5, $6)',
            [id, name, email, role, avatarUrl, department]
        );

        res.json({ id, name, email, role, avatarUrl, department });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==================== TEAMS ====================

app.get('/api/teams', async (req, res) => {
    try {
        const teamsResult = await pool.query('SELECT id, name, description, lead_technician_id as "leadTechnicianId" FROM teams');
        const membersResult = await pool.query('SELECT team_id, user_id FROM team_members');

        const teams = teamsResult.rows.map(team => ({
            ...team,
            memberIds: membersResult.rows
                .filter(m => m.team_id === team.id)
                .map(m => m.user_id)
        }));

        res.json(teams);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/teams', async (req, res) => {
    try {
        const { name, description, leadTechnicianId, memberIds } = req.body;
        const id = generateId();

        await pool.query(
            'INSERT INTO teams (id, name, description, lead_technician_id) VALUES ($1, $2, $3, $4)',
            [id, name, description, leadTechnicianId]
        );

        for (const memberId of (memberIds || [])) {
            await pool.query('INSERT INTO team_members (team_id, user_id) VALUES ($1, $2)', [id, memberId]);
        }

        res.json({ id, name, description, leadTechnicianId, memberIds: memberIds || [] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/teams/:teamId/members', async (req, res) => {
    try {
        const { teamId } = req.params;
        const { userId } = req.body;

        await pool.query('INSERT INTO team_members (team_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [teamId, userId]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==================== EQUIPMENT ====================

app.get('/api/equipment', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT id, name, serial_number as "serialNumber", location, status, 
             last_maintenance as "lastMaintenance", category, department, 
             assigned_to as "assignedTo", maintenance_team_id as "maintenanceTeamId", 
             technician_id as "technicianId", purchase_date as "purchaseDate", 
             warranty_expiration as "warrantyExpiration"
      FROM equipment
      ORDER BY created_at DESC
    `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/equipment', async (req, res) => {
    try {
        const { name, serialNumber, location, status, category, department, assignedTo, maintenanceTeamId, technicianId, purchaseDate, warrantyExpiration } = req.body;
        const id = generateId();

        await pool.query(
            `INSERT INTO equipment (id, name, serial_number, location, status, category, department, assigned_to, maintenance_team_id, technician_id, purchase_date, warranty_expiration) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
            [id, name || 'Unnamed Equipment', serialNumber || null, location || null, status || 'operational', category || null, department || null, assignedTo || null, maintenanceTeamId || null, technicianId || null, purchaseDate || null, warrantyExpiration || null]
        );

        res.json({ id, name: name || 'Unnamed Equipment', serialNumber, location, status: status || 'operational', lastMaintenance: 'Never', category, department, assignedTo, maintenanceTeamId, technicianId, purchaseDate, warrantyExpiration });
    } catch (err) {
        console.error('Equipment POST error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/equipment/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, serialNumber, location, status, category, department, assignedTo, maintenanceTeamId, technicianId, purchaseDate, warrantyExpiration, lastMaintenance } = req.body;

        await pool.query(
            `UPDATE equipment SET name=$1, serial_number=$2, location=$3, status=$4, category=$5, department=$6, assigned_to=$7, maintenance_team_id=$8, technician_id=$9, purchase_date=$10, warranty_expiration=$11, last_maintenance=$12
       WHERE id=$13`,
            [name, serialNumber, location, status, category, department, assignedTo, maintenanceTeamId, technicianId, purchaseDate, warrantyExpiration, lastMaintenance, id]
        );

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==================== TICKETS ====================

app.get('/api/tickets', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT t.id, t.title, t.equipment_id as "equipmentId", t.equipment_name as "equipmentName", 
             t.priority, t.status, t.type, t.assignee_id, t.date_created as "dateCreated", 
             t.description, t.scheduled_date as "scheduledDate",
             u.id as "assignee_id", u.name as "assignee_name", u.email as "assignee_email", 
             u.role as "assignee_role", u.avatar_url as "assignee_avatar", u.department as "assignee_dept"
      FROM tickets t
      LEFT JOIN users u ON t.assignee_id = u.id
      ORDER BY t.created_at DESC
    `);

        const tickets = result.rows.map(row => ({
            id: row.id,
            title: row.title,
            equipmentId: row.equipmentId,
            equipmentName: row.equipmentName,
            priority: row.priority,
            status: row.status,
            type: row.type,
            dateCreated: row.dateCreated,
            description: row.description,
            scheduledDate: row.scheduledDate,
            assignee: row.assignee_id ? {
                id: row.assignee_id,
                name: row.assignee_name,
                email: row.assignee_email,
                role: row.assignee_role,
                avatarUrl: row.assignee_avatar,
                department: row.assignee_dept
            } : undefined
        }));

        res.json(tickets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/tickets', async (req, res) => {
    try {
        const { title, equipmentId, equipmentName, priority, type, description, scheduledDate, assigneeId } = req.body;
        const id = generateId();
        const dateCreated = new Date().toISOString().split('T')[0];

        await pool.query(
            `INSERT INTO tickets (id, title, equipment_id, equipment_name, priority, status, type, assignee_id, date_created, description, scheduled_date) 
       VALUES ($1, $2, $3, $4, $5, 'new', $6, $7, $8, $9, $10)`,
            [id, title, equipmentId, equipmentName, priority, type, assigneeId, dateCreated, description, scheduledDate]
        );

        res.json({ id, title, equipmentId, equipmentName, priority, status: 'new', type, dateCreated, description, scheduledDate });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/tickets/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Get ticket to check if we need to update equipment
        const ticketResult = await pool.query('SELECT equipment_id FROM tickets WHERE id = $1', [id]);

        if (status === 'scrap' && ticketResult.rows.length > 0) {
            const equipmentId = ticketResult.rows[0].equipment_id;
            await pool.query('UPDATE equipment SET status = $1 WHERE id = $2', ['down', equipmentId]);
        }

        await pool.query('UPDATE tickets SET status = $1 WHERE id = $2', [status, id]);

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==================== ACTIVITIES ====================

app.get('/api/activities', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, type, message, timestamp, user_name as "user" FROM activities ORDER BY timestamp DESC LIMIT 50');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/activities', async (req, res) => {
    try {
        const { type, message, user } = req.body;
        const id = generateId();

        await pool.query(
            'INSERT INTO activities (id, type, message, user_name) VALUES ($1, $2, $3, $4)',
            [id, type, message, user]
        );

        res.json({ id, type, message, user, timestamp: new Date().toISOString() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==================== SYSTEM OPTIONS ====================

app.get('/api/options', async (req, res) => {
    try {
        const result = await pool.query('SELECT option_type, option_value FROM system_options');
        const options = {
            categories: [],
            departments: [],
            locations: []
        };

        result.rows.forEach(row => {
            if (options[row.option_type]) {
                options[row.option_type].push(row.option_value);
            }
        });

        res.json(options);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/options', async (req, res) => {
    try {
        const { type, value } = req.body;
        await pool.query(
            'INSERT INTO system_options (option_type, option_value) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [type, value]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
    console.log(`🚀 GearGuard API server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

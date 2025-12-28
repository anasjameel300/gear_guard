# 🛠️ GearGuard
  
  **The Ultimate Maintenance Tracker - Enterprise Asset Management System**
  
  [![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
</div>

---

## 📋 Overview

GearGuard is a comprehensive enterprise asset management system designed to streamline equipment maintenance operations. It provides organizations with tools to track equipment, manage maintenance requests, coordinate teams, and maintain a complete audit trail of all maintenance activities.

## ✨ Features

### 🎛️ Dashboard
- Real-time overview of equipment status and maintenance metrics
- Activity feed showing recent system events
- Quick access to pending maintenance tasks

### 🔧 Equipment Management
- Complete equipment inventory with detailed specifications
- Track equipment status (Operational, Under Maintenance, Down)
- Equipment details including serial numbers, locations, warranty info
- Assign equipment to departments and technicians

### 🎫 Maintenance Tracking (Kanban Board)
- Visual Kanban-style maintenance request management
- Drag-and-drop ticket status updates
- Support for corrective and preventive maintenance types
- Priority levels (Low, Medium, High)
- Ticket statuses: New → In Progress → On Hold → Completed/Repaired/Scrap

### 👥 Team Management
- Create and manage maintenance teams (Mechanics, Electricians, IT, etc.)
- Assign team leads and members
- Track team responsibilities and workload

### ⚙️ Settings
- System configuration options
- Manage categories, departments, and locations
- User role management (Admin, Manager, Technician)

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - UI Library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **React Router 6** - Client-side routing
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
gear_guard/
├── components/           # Reusable UI components
│   ├── Layout.tsx       # Main app layout with sidebar
│   ├── AuthLayout.tsx   # Authentication pages layout
│   └── ui/              # Basic UI components
├── context/             # React Context providers
│   ├── AuthContext.tsx  # Authentication state management
│   └── DataContext.tsx  # Application data management
├── pages/               # Page components
│   ├── Dashboard.tsx    # Main dashboard
│   ├── Equipment.tsx    # Equipment listing
│   ├── EquipmentDetail.tsx  # Equipment details view
│   ├── Maintenance.tsx  # Kanban maintenance board
│   ├── Teams.tsx        # Team management
│   ├── Settings.tsx     # System settings
│   ├── Login.tsx        # Login page
│   └── Signup.tsx       # Registration page
├── server/              # Backend server
│   ├── index.js         # Express server & API routes
│   ├── db.js            # PostgreSQL connection
│   ├── schema.sql       # Database schema
│   └── seed.js          # Sample data seeding
├── App.tsx              # Main app component with routing
├── types.ts             # TypeScript type definitions
└── vite.config.ts       # Vite configuration
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **PostgreSQL** (v14 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/anasjameel300/gear_guard.git
   cd gear_guard
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Configure environment variables**

   Create `.env.local` in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   ```

   Create `.env` in the `server` directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/gearguard
   PORT=3001
   ```

5. **Set up the database**
   ```bash
   # Create the database
   psql -U postgres -c "CREATE DATABASE gearguard;"
   
   # Run the schema
   psql -U postgres -d gearguard -f server/schema.sql
   
   # Seed sample data (optional)
   cd server
   npm run seed
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm start
   ```
   The API will be available at `http://localhost:3001`

2. **Start the frontend development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/signup` | User registration |

### Equipment
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/equipment` | Get all equipment |
| GET | `/api/equipment/:id` | Get equipment by ID |
| POST | `/api/equipment` | Create new equipment |
| PUT | `/api/equipment/:id` | Update equipment |
| DELETE | `/api/equipment/:id` | Delete equipment |

### Maintenance Tickets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tickets` | Get all tickets |
| POST | `/api/tickets` | Create new ticket |
| PUT | `/api/tickets/:id` | Update ticket |
| DELETE | `/api/tickets/:id` | Delete ticket |

### Teams
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/teams` | Get all teams |
| POST | `/api/teams` | Create new team |
| PUT | `/api/teams/:id` | Update team |
| DELETE | `/api/teams/:id` | Delete team |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |

## 👤 User Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Full system access, manage users and settings |
| **Manager** | Manage equipment, teams, and maintenance requests |
| **Technician** | View and update assigned maintenance tickets |

## 🗄️ Database Schema

The application uses the following main tables:
- `users` - User accounts and authentication
- `teams` - Maintenance teams
- `team_members` - Team membership (many-to-many)
- `equipment` - Equipment inventory
- `tickets` - Maintenance requests
- `activities` - Audit log
- `system_options` - System configuration

## 🔧 Build for Production

```bash
# Build the frontend
npm run build

# Preview the production build
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Made with ❤️ for efficient maintenance management</p>
</div>

# Expensify - Enterprise SaaS Expense Platform

A world-class, premium Internal Expense & Reimbursement Management SaaS platform. Built with a clean, minimal UI inspired by modern enterprise products (Zoho, Stripe Dashboard, Linear).

---

## 🚀 Quick Start Guide

### 🛠 Prerequisites
Ensure you have the following installed:
* **Node.js** (v18 or higher recommended)
* **npm** or **pnpm** (Package Managers)
* **PostgreSQL** (Database)

---

## 🏗 Architecture & Tech Stack

*   **Frontend:** React 19, Vite, Tailwind CSS 4, Ant Design, Redux Toolkit, RTK Query.
*   **Backend:** Node.js, Express.js, PostgreSQL.
*   **ORM:** Prisma (Type-safe database access).
*   **Authentication:** JWT (JSON Web Tokens).

---

## 📂 Project Structure

```text
Rreimbursement/
├── client/           # React Frontend (Vite)
├── server/           # Node.js Backend (Express)
│   └── prisma/       # Database Schema & Seed
```

---

## ⚡ Command Reference

### 💻 Frontend (Client)
Navigate to `/client` before running these:
| Command | Description |
| :--- | :--- |
| `pnpm install` | Install all dependencies |
| `pnpm run dev` | Start development server (http://localhost:5173) |
| `pnpm run build` | Build for production |
| `pnpm run preview` | Preview production build |
| `pnpm run lint` | Run ESLint to check for code quality |

### ⚙️ Backend (Server)
Navigate to `/server` before running these:
| Command | Description |
| :--- | :--- |
| `pnpm install` | Install all dependencies |
| `npx prisma generate` |
| `pnpm run dev` | Start server with Nodemon (auto-reload) |
| `pnpm start` | Start server in production mode |
| `pnpm run seed` | Seed the database with initial data |
| `pnpm add nodemailer` | Install nodemailer |

### 💎 Database & Prisma
Run these inside the `/server` directory:
| Command | Description |
| :--- | :--- |
| `npx prisma db push` | Sync schema with database (Development) |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma studio` | Open GUI to view/edit database data |
| `pnpm run prisma:push` | Alias for `prisma db push` |
| `pnpm run prisma:generate` | Alias for `prisma generate` |

---

## 🛠 Setup Instructions

### 1. Database Configuration
**Option A: Cloud (Recommended)**
1. Create a free account on [Neon.tech](https://neon.tech/) or [Supabase](https://supabase.com/).
2. Copy your PostgreSQL connection string.

**Option B: Local (PostgreSQL)**
1. Install PostgreSQL on your machine.
2. Create a database named `reimbursement_db`.

### 2. Environment Variables
In the `server/` directory, create/edit the `.env` file:
```env
PORT=5000
DATABASE_URL="postgresql://postgres:password@localhost:5432/reimbursement_db?schema=public"
JWT_SECRET="your_secret_key"
```

### 3. Initialize & Run
```bash
# Setup Backend
cd server
npm install
npx prisma db push
npm run seed  # Optional: Seed initial data
npm run dev

# Setup Frontend (New Terminal)
cd client
npm install
npm run dev
```

---

## 💡 Key Features
- **Role-Based Access:** Employee and Admin portals.
- **Dynamic Claims:** Real-time claim status tracking.
- **Email Notifications:** automated emails for status updates (using Resend/Nodemailer).
- **Responsive Design:** Optimized for all screen sizes.

---

### 👤 Default Admin Access
To elevate a user to **ADMIN**:
1. Register a new account via the UI.
2. Open **Prisma Studio** (`npx prisma studio`).
3. Change the user's `role` from `EMPLOYEE` to `ADMIN`.

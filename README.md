# Expensify - Enterprise SaaS Expense Platform

A world-class, premium Internal Expense & Reimbursement Management SaaS platform. Built with a clean, minimal UI inspired by modern enterprise products (Zoho, Stripe Dashboard, Linear).

## Architecture

* **Frontend:** React, Vite, Tailwind CSS, Ant Design, Redux Toolkit, RTK Query
* **Backend:** Node.js, Express.js, PostgreSQL, Prisma ORM, JWT Authentication
* **Data Flow:** Fully decoupled REST APIs. The frontend uses RTK Query exclusively for caching and fetching (no `useEffect` data fetching).

---

## Prerequisites
Before you begin, ensure you have installed:
1. **Node.js** (v16 or higher) npx prisma studio
2. **PostgreSQL** (See Database Setup instructions below)

---

## 0. Database Setup (Choose Option A or B)

### Option A: The Easiest Way (Cloud Database - No Installation)
You can use a free cloud PostgreSQL provider like **Neon** or **Supabase**. It takes 2 minutes and you don't have to install anything on your PC.
1. Go to [neon.tech](https://neon.tech/) or [supabase.com](https://supabase.com/) and create a free account.
2. Create a new project/database.
3. Once created, they will give you a **Connection String** (e.g., `postgresql://username:password@...`). Copy that string.

### Option B: Local Installation (Windows)
If you want to install PostgreSQL directly onto your Windows machine:
1. Go to the [PostgreSQL Windows Download Page](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads).
2. Download the installer for Windows x86-64 (version 16 or 17) and run it. 
3. **CRITICAL:** During installation, it will ask you to set a password for the "postgres" superuser. Remember this password.
4. Open **pgAdmin 4** (installed alongside PostgreSQL) and enter your password.
5. In the left sidebar, expand **Servers** -> **PostgreSQL**.
6. Right-click on **Databases** -> **Create** -> **Database...**
7. Name it exactly: `reimbursement_db` and click Save.

---

## 1. Backend Setup (Server)

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Setup your Environment Variables:
   Open the `server/.env` file and ensure your `DATABASE_URL` matches your local PostgreSQL credentials. The default is set to:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/reimbursement_db?schema=public"
   JWT_SECRET="your-super-secret-jwt-key"
   ```
   *(Make sure to create a database named `reimbursement_db` in your PostgreSQL instance if it doesn't exist)*

4. Push the Prisma Schema to your database:
   ```bash
   npx prisma db push
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```
   *The server will start on http://localhost:5000*

---

## 2. Frontend Setup (Client)

1. Open a new terminal window and navigate to the client directory:
   ```bash
   cd client
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will start on http://localhost:5173*

---

## Default Roles
- By default, new users register with the `EMPLOYEE` role.
- To test the `ADMIN` dashboard, you can register a user, then open your database (using PgAdmin or `npx prisma studio`) and change their role from `EMPLOYEE` to `ADMIN`.

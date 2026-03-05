# Internship Management System - Setup Guide

## Prerequisites
- Node.js 18+ installed
- PostgreSQL installed and running

## Quick Setup

### 1. Create PostgreSQL Database
```sql
CREATE DATABASE internship_db;
```

### 2. Setup Backend
```bash
cd "c:\Users\Hp\OneDrive\Desktop\Internship Management System\internship-backend"

# Install dependencies
npm install

# Configure database (edit .env file if needed)
# Default: postgresql://postgres:postgres@localhost:5432/internship_db

# Create tables
psql -U postgres -d internship_db -f config/schema.sql

# Seed demo data
npm run seed

# Start server
npm run dev
```

### 3. Setup Frontend
```bash
cd "c:\Users\Hp\OneDrive\Desktop\Internship Management System\internship-frontend"

# Start dev server
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Demo Accounts
| Role | Email | Password |
|------|-------|----------|
| Admin | qq@gmail.com | Q111111 |
| Company | ww@gmail.com | W111111 |
| Student | ee@gmail.com | E111111 |

## Tech Stack
- **Frontend**: React 19 + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL (raw SQL)
- **Auth**: JWT + bcryptjs

## Features
- ✅ Role-based access (Admin, Company, Student)
- ✅ Internship CRUD operations
- ✅ Application workflow (Apply → Accept/Reject)
- ✅ Resume upload/download
- ✅ Notification bell
- ✅ Analytics dashboards
- ✅ Multi-step application wizard
- ✅ Search & filtering

## Team
- Rudra Goswami
- Shreya Manavadariya
- Kush Thakar (Cyber Raavan)

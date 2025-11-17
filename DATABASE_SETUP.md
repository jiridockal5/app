# Database Setup Guide

## ✅ What's Been Done

1. ✅ Installed Prisma Client and Prisma CLI
2. ✅ Generated Prisma Client
3. ✅ Created `.env` file with database connection string
4. ✅ Created Prisma client singleton (`src/lib/prisma.ts`)
5. ✅ Created API routes for database operations:
   - `/api/users` - User management
   - `/api/scenarios` - Scenario CRUD operations
   - `/api/scenarios/[id]` - Single scenario operations

## 🔴 IMPORTANT: Update Your Password

The `.env` file currently has a placeholder password. You need to:

1. Open `.env` file
2. Replace `YOUR_DB_PASSWORD` with your actual Supabase database password
3. Get your password from:
   - Supabase Dashboard → Project Settings → Database → Connection String
   - Or from your Prisma Console

Your `.env` should look like:
```env
DATABASE_URL="postgres://postgres:ACTUAL_PASSWORD_HERE@db.euzufmotefbycjdlqclf.supabase.co:5432/postgres?sslmode=require"
```

## 📋 Next Steps

### Step 1: Update Password in .env
```bash
# Edit .env and replace YOUR_DB_PASSWORD with actual password
nano .env
# or
code .env
```

### Step 2: Push Database Schema
Once password is updated, run:
```bash
npm run db:push
```

This will create the `User` and `Scenario` tables in your Supabase database.

### Step 3: Verify Connection
Test the database connection:
```bash
npx prisma studio
```

This opens Prisma Studio (GUI) to view your database.

### Step 4: Test API Routes
Once the database is set up, you can test the API:

**Create a user:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "secure_password"
  }'
```

**Create a scenario:**
```bash
curl -X POST http://localhost:3000/api/scenarios \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID_FROM_ABOVE",
    "name": "My First Scenario",
    "dialValues": {
      "startArrUsd": 2400000,
      "acvUsd": 6000,
      "newLogosPerMonth": 30
    }
  }'
```

**Get scenarios for a user:**
```bash
curl http://localhost:3000/api/scenarios?userId=USER_ID
```

## 🗄️ Database Schema

Your Prisma schema includes two models:

### User
- `id` (String, UUID)
- `email` (String, unique)
- `name` (String, optional)
- `passwordHash` (String)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- `scenarios` (Relation to Scenario[])

### Scenario
- `id` (String, UUID)
- `userId` (String, foreign key to User)
- `name` (String)
- `dialValues` (JSON) - Stores the assumptions/settings
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- `user` (Relation to User)

## 🔧 Available Commands

```bash
# Generate Prisma Client (after schema changes)
npm run db:generate

# Push schema to database (no migrations)
npm run db:push

# Create and run migrations (recommended for production)
npm run db:migrate

# Open Prisma Studio (database GUI)
npm run db:studio
```

## 🚀 Integration with Your App

The app currently uses **localStorage** for data persistence. To integrate the database:

### Option 1: Hybrid Approach (Recommended for now)
Keep localStorage as default, add "Save to Cloud" button that saves to database.

### Option 2: Full Database Integration
Replace Zustand store with API calls to database.

### Current Status
- ✅ Database connection ready
- ✅ API routes created
- ⏳ Frontend integration (pending)
- ⏳ Authentication (pending)

## 📚 API Routes Reference

### Users API

**POST /api/users** - Create user
```json
{
  "email": "user@example.com",
  "name": "User Name",
  "password": "password123"
}
```

**GET /api/users?email=user@example.com** - Get user by email

### Scenarios API

**GET /api/scenarios?userId=USER_ID** - List all scenarios for user

**POST /api/scenarios** - Create scenario
```json
{
  "userId": "user-id",
  "name": "Q4 2024 Plan",
  "dialValues": {
    "horizonMonths": 12,
    "startArrUsd": 2400000,
    "acvUsd": 6000,
    "newLogosPerMonth": 30,
    "churnMonthly": 0.008,
    "upsellMonthly": 0.003,
    "collectSplit": [0.25, 0.75],
    "startCashUsd": 500000,
    "payrollPerMonthUsd": 220000,
    "opexPerMonthUsd": 60000
  }
}
```

**GET /api/scenarios/:id** - Get single scenario

**PUT /api/scenarios/:id** - Update scenario
```json
{
  "name": "Updated Name",
  "dialValues": { ... }
}
```

**DELETE /api/scenarios/:id** - Delete scenario

## 🔐 Security Notes

⚠️ **IMPORTANT:** The current user API uses basic password hashing. For production:

1. Install bcrypt: `npm install bcrypt @types/bcrypt`
2. Replace the password hashing in `/api/users/route.ts`
3. Implement proper authentication (NextAuth.js recommended)
4. Add API route protection middleware
5. Validate user ownership for scenarios

## ⚡ Troubleshooting

### "Error: P1001: Can't reach database server"
- Check that DATABASE_URL password is correct
- Verify Supabase project is running
- Check network connection

### "Error: P3009: Failed to create migration"
- Use `npm run db:push` instead (no migration files)
- Or ensure you have write access to `prisma/migrations/`

### Prisma Client out of sync
```bash
npm run db:generate
```

## 📝 Next Steps for Full Integration

1. ✅ Update `.env` with real password
2. ✅ Run `npm run db:push`
3. ⏳ Add authentication (NextAuth.js)
4. ⏳ Create UI for saving scenarios to cloud
5. ⏳ Add scenario loading from database
6. ⏳ Implement user signup/login pages

---

**Database:** Supabase PostgreSQL  
**ORM:** Prisma 6.19.0  
**Status:** Ready for password configuration

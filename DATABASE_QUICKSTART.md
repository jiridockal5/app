# 🚀 Database Connection - Quick Start

## ⚡ What You Need to Do NOW

### 1. Update Your Password (2 minutes)

Open `.env` file and replace `YOUR_DB_PASSWORD` with your actual Supabase password:

```bash
# Edit .env file
nano .env  # or code .env or vim .env
```

**Get your password from:**
- Supabase Dashboard: Settings → Database → Connection String
- Or your Prisma Console
- Or Supabase "Database Settings" page

### 2. Create Database Tables (30 seconds)

```bash
npm run db:push
```

This creates the `User` and `Scenario` tables in your Supabase database.

### 3. Verify It Works (optional)

```bash
# Open Prisma Studio to view your database
npm run db:studio
```

Browser will open at http://localhost:5555 showing your database tables.

---

## ✅ What's Already Done For You

1. ✅ Installed Prisma Client & CLI
2. ✅ Generated Prisma Client
3. ✅ Created database connection file (`src/lib/prisma.ts`)
4. ✅ Created API routes:
   - `POST /api/users` - Create user
   - `GET /api/users?email=x` - Get user
   - `GET /api/scenarios?userId=x` - List scenarios
   - `POST /api/scenarios` - Create scenario
   - `GET /api/scenarios/:id` - Get scenario
   - `PUT /api/scenarios/:id` - Update scenario
   - `DELETE /api/scenarios/:id` - Delete scenario
5. ✅ Added npm scripts for database management
6. ✅ TypeScript types all configured

---

## 📋 Available Commands

```bash
# Database commands
npm run db:push       # Push schema to database (creates tables)
npm run db:studio     # Open database GUI
npm run db:generate   # Regenerate Prisma Client
npm run db:migrate    # Create migration files

# Development
npm run dev           # Start dev server (with database)
npm run build         # Production build
npm test              # Run tests
```

---

## 🧪 Test Your Database Connection

Once you've updated the password and run `npm run db:push`, test the API:

### Start dev server:
```bash
npm run dev
```

### Create a test user:
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "test123"
  }'
```

### Create a scenario:
```bash
curl -X POST http://localhost:3000/api/scenarios \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID_FROM_ABOVE",
    "name": "Test Scenario",
    "dialValues": {
      "startArrUsd": 2400000,
      "acvUsd": 6000,
      "newLogosPerMonth": 30
    }
  }'
```

---

## 📁 Files Created

```
.env                                    ← UPDATE PASSWORD HERE!
src/lib/prisma.ts                       ← Database client
src/app/api/users/route.ts              ← User API
src/app/api/scenarios/route.ts          ← Scenarios list API
src/app/api/scenarios/[id]/route.ts     ← Single scenario API
DATABASE_SETUP.md                       ← Full documentation
DATABASE_QUICKSTART.md                  ← This file
```

---

## 🔐 Security Note

⚠️ The current implementation is **MVP-level**. Before production:

1. Add proper authentication (NextAuth.js)
2. Add API route protection
3. Use bcrypt for password hashing
4. Add input validation
5. Add rate limiting

---

## ❓ Troubleshooting

**Problem:** `npm run db:push` fails with "Can't reach database"  
**Solution:** Double-check your password in `.env`

**Problem:** Prisma Studio won't open  
**Solution:** Make sure port 5555 is not in use

**Problem:** API returns 500 error  
**Solution:** Check that `npm run db:push` completed successfully

---

## 📚 Full Documentation

See `DATABASE_SETUP.md` for:
- Complete API reference
- Database schema details
- Integration guide
- Security recommendations

---

**Status:** ✅ Ready to connect (just needs password)  
**Database:** Supabase PostgreSQL  
**ORM:** Prisma 6.19.0

---

## ⏭️ Next: Frontend Integration

After database is connected, you can:

1. Add "Save to Cloud" button in your app
2. Add "Load from Cloud" functionality
3. Implement user authentication
4. Replace localStorage with database (optional)

See your Q&A document - this answers questions #1 and #2! 🎉

# Lost & Found Application - AI Coding Instructions

## Project Overview

A full-stack Lost and Found management system for tracking found items on a university campus. Users can browse items, submit claims, and admins manage the entire workflow.

**Tech Stack:** React 19 + TypeScript (frontend), Node.js + Express (backend), **Prisma ORM**, PostgreSQL, Cloudinary (image hosting)

## Architecture

### Backend Structure (Node.js/Express)

- **Layered Architecture**: Controllers → Repositories → **Prisma ORM** → Database
  - `controllers/`: Business logic and request handling
  - `repositories/`: Data access layer using **Prisma Client**
  - `routes/`: Express route definitions
  - `config/`: **Prisma Client**, Cloudinary, and Multer configuration
  - `middlewares/`: Error handling
  - `prisma/`: Schema definition and migrations

### Frontend Structure (React + TypeScript)

- **State Management**: React hooks + localStorage for auth/state persistence
- **Routing**: React Router with role-based protected routes (`ProtectedAdminRoute`, `ProtectedUserRoute`)
- **Key State in App.tsx**: `items`, `selectedItem`, `user` - lifted state passed to child components via props
- **API Integration**: Centralized API config (`config/api.ts`) with `/api/v1` base URL
- **API Utility**: Uses axios instance with `API_ENDPOINTS` constants for type-safe API calls

## API Structure (RESTful)

**Base URL:** `/api/v1`

### Endpoints:

- **Auth:** `/api/v1/auth/login`, `/api/v1/auth/register`
- **Items:** `/api/v1/items`, `/api/v1/items/:id`, `/api/v1/items/:id/claim`
- **Categories:** `/api/v1/categories`, `/api/v1/categories/:id/status`
- **Claims:** `/api/v1/claims`, `/api/v1/claims/user/:userId`, `/api/v1/claims/:id/status`

## Critical Patterns

### 1. Database Queries (Prisma ORM)

All database access uses **Prisma Client**. Example from `repositories/barangRepository.js`:

```javascript
async findAll() {
  return await prisma.barang.findMany({
    include: {
      category: true,
      _count: { select: { claimRequests: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}
```

**Key Prisma Patterns:**

- Use `include` for relations instead of JOIN queries
- Use `select` to choose specific fields
- Prisma automatically handles connection pooling
- Return types are fully typed (great for TypeScript)

### 2. Prisma Schema Conventions

Located in `prisma/schema.prisma`:

- **Models use PascalCase**: `User`, `Barang`, `KategoriBarang`
- **Fields use camelCase**: `foundDate`, `categoryId`
- **Database columns use snake_case**: `@map("found_date")`
- **Table names use snake_case**: `@@map("barang")`
- **Enums for status fields**: `BarangStatus`, `ClaimStatus`, `Role`

### 3. Relations & Includes

Prisma handles relations declaratively:

```javascript
// One-to-many: Get barang with category
const barang = await prisma.barang.findUnique({
  where: { id },
  include: { category: true },
});

// Nested includes: Get claim with barang and user
const claim = await prisma.claimRequest.findUnique({
  where: { id },
  include: {
    barang: { include: { category: true } },
    user: { select: { id: true, name: true, nim: true } },
  },
});
```

### 4. Response Transformation (Minimal with Prisma)

Prisma returns camelCase by default due to `@map()` in schema. Controllers only need to structure nested objects:

```javascript
// Minimal transformation needed
const formatted = items.map((item) => ({
  ...item,
  kategoriBarang: item.category, // Rename for frontend compatibility
  claimCount: item._count?.claimRequests || 0,
}));
```

### 5. Error Handling

Prisma-specific errors to handle in `errorHandler.js`:

- `PrismaClientKnownRequestError`: Unique constraint, foreign key violations
  - `P2002`: Unique constraint violation
  - `P2025`: Record not found
  - `P2003`: Foreign key constraint violation
- `PrismaClientValidationError`: Invalid data types

```javascript
// Error mapping example
if (err.code === "P2002") {
  const field = err.meta?.target?.[0] || "field";
  return res.status(409).json({
    message: `${field} sudah digunakan`,
  });
}
```

### 6. PrismaClient Singleton Pattern

Located in `config/prisma.js` - follows official documentation best practices:

```javascript
const prismaClientSingleton = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["error"],
  });
};

const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

**Why Singleton?**

- Each PrismaClient instance creates its own connection pool
- Multiple instances can exhaust database connections
- Global variable prevents hot-reload issues in development

**Why Singleton?**

- Each PrismaClient instance creates its own connection pool
- Multiple instances can exhaust database connections
- Global variable prevents hot-reload issues in development

### 7. Image Upload Flow (Multer + Cloudinary)

- Multer stores images in **memory** (not disk): `multer.memoryStorage()`
- Files uploaded as buffers to Cloudinary via `uploadToCloudinary(buffer, folder, publicId)`
- Multi-file uploads use `upload.fields([{name: "itemPhoto"}, {name: "finderPhoto"}])`
- Single uploads use `upload.single("claimerPhoto")`

### 8. Authentication & Authorization

- Auth data stored in localStorage: `localStorage.getItem("authToken")` returns full User object
- User object structure: `{id, name, nim, email, contact, role: "admin" | "user"}`
- Protected routes check role: admin routes redirect users, user routes redirect admins
- **No JWT/session middleware** - frontend manages auth state

## Development Workflow

### Running the Application

```powershell
# Backend (from backend/)
npm run dev                # Starts nodemon on port 2006
npm run prisma:studio      # Opens Prisma Studio (database GUI)
npm run prisma:generate    # Generate Prisma Client after schema changes
npm run prisma:migrate     # Create and apply migrations

# Frontend (from frontend/)
npm run dev          # Starts Vite dev server (default port 5173)
```

### Prisma Commands

```powershell
# Generate Prisma Client after schema changes
npm run prisma:generate

# Create and apply migration
npm run prisma:migrate

# Push schema changes without creating migration (dev only)
npm run prisma:push

# Pull schema from database (introspection)
npm run prisma:pull

# Open Prisma Studio (GUI for database)
npm run prisma:studio

# Format schema file
npm run prisma:format
```

### Environment Variables (backend/.env)

```
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
PORT=2006
NODE_ENV=development
```

### Database Schema Convention

- Tables use `snake_case`: `barang`, `kategori_barang`, `users`, `claim_requests`
- Columns use `snake_case`: `found_date`, `category_id`, `created_at`
- **Prisma models use PascalCase**: `Barang`, `KategoriBarang`, `User`
- **Prisma fields use camelCase**: `foundDate`, `categoryId`, `createdAt`
- **`@map()` bridges Prisma ↔ Database naming**
- Status fields use **Enums**: `BarangStatus`, `ClaimStatus`, `Role`

## Common Tasks

### Adding a New Feature

1. **Backend**:
   - Update `prisma/schema.prisma` if needed
   - Run `npm run prisma:migrate` to apply changes
   - Create repository method (Prisma queries)
   - Create controller method
   - Add route
2. **Frontend**: Add TypeScript type in `types/index.ts` → API call in page component → update UI

### Adding a New Model/Entity

1. Update `prisma/schema.prisma`:

```prisma
model NewEntity {
  id        Int      @id @default(autoincrement())
  name      String
  createdAt DateTime @default(now()) @map("created_at")

  @@map("new_entities")
}
```

2. Run `npm run prisma:migrate --name add_new_entity`
3. Create repository in `repositories/`
4. Create controller in `controllers/`
5. Add routes in `routes/`
6. Register routes in `app.js`
7. Add TypeScript type in frontend `types/index.ts`

### Querying with Prisma

```javascript
// Simple query
await prisma.barang.findMany();

// With where clause
await prisma.barang.findMany({
  where: { status: "DITEMUKAN" },
});

// With relations
await prisma.barang.findMany({
  include: { category: true },
});

// With search (case insensitive)
await prisma.barang.findMany({
  where: {
    OR: [
      { name: { contains: keyword, mode: "insensitive" } },
      { description: { contains: keyword, mode: "insensitive" } },
    ],
  },
});

// Count relations
await prisma.barang.findMany({
  include: {
    _count: { select: { claimRequests: true } },
  },
});
```

### File Upload Endpoints

- Always use FormData on frontend: `formData.append("itemPhoto", file)`
- Backend expects `req.files` (multiple) or `req.file` (single)
- Upload to Cloudinary returns URL string, store in database as VARCHAR

## Key Files Reference

- `prisma/schema.prisma`: **Database schema and models definition**
- `backend/src/config/prisma.js`: **Prisma Client singleton instance**
- `backend/src/repositories/*.js`: **Data access layer using Prisma**
- `backend/src/app.js`: Express app setup & route registration
- `frontend/src/App.tsx`: Main routing & lifted state management
- `frontend/src/types/index.ts`: All TypeScript interfaces
- `backend/src/middlewares/errorHandler.js`: Centralized error mapping (includes Prisma errors)

## Migration Notes

- **Migrated from raw SQL to Prisma ORM** - academic requirement for learning ORM
- Prisma handles type safety, connection pooling, and query building automatically
- Database schema unchanged (still PostgreSQL with snake_case columns)
- `@map()` decorators bridge Prisma camelCase ↔ database snake_case
- All queries now type-safe and intellisense-enabled

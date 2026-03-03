# NammaKadai Stationery Platform

Stationery product showcase built with:

- **Storefront**: Next.js (TypeScript, TailwindCSS)
- **Admin panel**: React (Vite + TypeScript)
- **Backend API**: Node.js + Express + MongoDB (Mongoose)

## Apps

- `backend/` – REST API for products and users, JWT-based admin auth
- `storefront/` – public product showcase site
- `admin/` – admin dashboard for managing products and users

## Prerequisites

- Node.js 20+
- npm
- MongoDB (local or MongoDB Atlas)
- Docker (optional, for containerized dev/prod)

## Environment variables

Create a `.env` file in `backend/`:

```bash
MONGODB_URI=mongodb://localhost:27017/stationery_showcase
JWT_SECRET=devsecret
PORT=5003
ADMIN_DEFAULT_EMAIL=admin@example.com
ADMIN_DEFAULT_PASSWORD=admin123
CLIENT_ORIGINS=http://localhost:5001,http://localhost:5002
```

Storefront (`storefront/.env.local`):

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5003
```

Admin (`admin/.env`):

```bash
VITE_API_BASE_URL=http://localhost:5003
```

## Local development (without Docker)

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

Seed admin user and sample products:

```bash
npm run seed
```

### 2. Storefront

```bash
cd storefront
npm install
npm run dev
```

Visit `http://localhost:3000` (or `http://localhost:5001` when using Docker).

### 3. Admin panel

```bash
cd admin
npm install
npm run dev
```

Visit `http://localhost:5173` (or `http://localhost:5002` when using Docker) and log in with the seeded admin credentials.

## Docker-based development

From the repository root:

```bash
docker compose -f docker-compose.dev.yml up --build
```

Services:

- MongoDB: `mongodb://localhost:27017/stationery_showcase`
- Backend API: `http://localhost:5003`
- Storefront: `http://localhost:5001`
- Admin: `http://localhost:5002`

## Docker production compose

From the repository root:

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

Services:

- Backend API: `http://localhost:5003`
- Storefront: `http://localhost:5001`
- Admin: `http://localhost:5002`

Update `JWT_SECRET`, `CLIENT_ORIGINS`, and MongoDB connection for real deployments.

## API overview

- `POST /api/auth/login` – admin login, returns JWT
- `GET /api/products` – public product listing (filters: `page`, `limit`, `category`, `search`, `minPrice`, `maxPrice`, `featured`)
- `GET /api/products/:slug` – public product detail
- `GET /api/admin/products` – list products (admin, JWT required)
- `POST /api/admin/products` – create product
- `PUT /api/admin/products/:id` – update product
- `DELETE /api/admin/products/:id` – delete product
- `GET /api/admin/users` – list users
- `POST /api/admin/users` – create user
- `PUT /api/admin/users/:id` – update user (includes role/status/password)
- `DELETE /api/admin/users/:id` – delete user (protects last active admin)


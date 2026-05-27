<div align="center">

# FavoritPro

### Professional Sports Betting Predictions Platform

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-new--york-black)](https://ui.shadcn.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.11-2d3748?logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](./LICENCE)

---

**Author:** Dupley Maxim Igorevich

**Intellectual Property:** Dupley Maxim Igorevich

</div>

---

## About the Project

**FavoritPro** is a comprehensive web platform for professional sports betting predictions. The project combines an expert prediction system, interactive matches with live odds, a bet slip calculator, a user cabinet with subscription tiers, gamification with achievements, and analytical statistics.

The platform supports 6 sports categories: football, hockey, basketball, tennis, cybersport, and volleyball.

## Key Features

- **6 sport categories** — football, hockey, basketball, tennis, cybersport, volleyball
- **Live matches** — real-time match tracking with animated odds fluctuations
- **Expert predictions** — analytics from 6 experts with ratings and performance stats
- **Bet slip** — single, express, and system bet types with profit and ROI calculation
- **Bet calculator** — potential winnings calculation for all bet types
- **User cabinet** — 4 tabs: activity, favorites, subscriptions, settings
- **Subscription tiers** — 3 plans: Free, Pro (1490₽), VIP (3990₽)
- **10 achievements** — gamification system with badges
- **Hot streaks** — tracking experts' winning streaks
- **Team comparison** — visual side-by-side team statistics
- **Match timeline** — live match events feed (goals, cards, substitutions)
- **Daily tips** — auto-rotating carousel of betting tips
- **Notifications** — bell with alerts for wins, LIVE events, and predictions
- **Search** — live search across matches, experts, and predictions
- **Dark and light themes** — toggle via Zustand store
- **Responsive design** — full mobile device support with bottom navigation
- **PWA support** — manifest, meta tags, installable on devices
- **Glassmorphism design** — modern UI with backdrop-blur effects

## Platform Sections

| # | Section | Description |
|---|---------|-------------|
| 1 | **Main** | Hero with stats, live ticker, hot streaks, live matches, express of the day, expert predictions, daily tips, news |
| 2 | **Sports** | Sport categories with match counts, sport filter chips |
| 3 | **Experts** | Expert rating table with win rates, ROI, streaks, and last results |
| 4 | **Stats** | Monthly statistics, sport breakdown, performance charts (bar, line, pie) |
| 5 | **News** | Sports news cards with categories, images, and read times |
| 6 | **Results** | Finished matches with final scores and prediction outcomes |
| 7 | **Calculator** | Bet calculator with single/express/system tabs, stake input, profit/ROI display |

## Bet Slip System

| Tab | Description |
|-----|-------------|
| **Single** | Individual bets with stake and potential payout |
| **Express** | Combined bets — total odds multiply, all must win |
| **System** | Partial coverage system bets (e.g., 2/3, 2/4) |

Clicking odds on any match adds the selection to the bet slip with toast notification.

## XP and Achievements

| # | Achievement | Requirement |
|---|-------------|-------------|
| 1 | First Bet | Place your first bet |
| 2 | First Win | Win your first prediction |
| 3 | Hot Streak | Follow an expert with 5+ win streak |
| 4 | Collector | Add 5 matches to favorites |
| 5 | Analyst | View detailed match analysis |
| 6 | Subscriber | Subscribe to an expert |
| 7 | Pro User | Upgrade to Pro tier |
| 8 | VIP Member | Upgrade to VIP tier |
| 9 | Active Player | 30 days of activity |
| 10 | Expert Level | 100+ predictions tracked |

## Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16 | React framework with App Router |
| **TypeScript** | 5 | Static typing for code reliability |
| **Tailwind CSS** | 4 | Utility-first CSS for rapid UI development |
| **shadcn/ui** | — | UI components in New York style |
| **Prisma** | 6.11 | ORM with SQLite/PostgreSQL/MySQL support |
| **Zustand** | 5 | Lightweight state management with localStorage |
| **React Query** | 5.82 | API request caching and state management |
| **Recharts** | 2 | Interactive charts and data visualization |
| **Framer Motion** | 12 | Smooth animations and transitions |
| **React Hook Form** | 7.60 | Form management |
| **Zod** | 4.0 | Schema validation |
| **next-auth** | 4.24 | Authentication |
| **next-intl** | 4.3 | Internationalization |

## Installation and Setup

### Prerequisites

- **Node.js** version 18 or higher (20+ recommended)
- **npm**, **yarn**, **pnpm**, or **bun** as package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/favorit-pro.git
cd favorit-pro

# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Run in development mode
npm run dev
```

The application will be available at `http://localhost:3000`.

### Production Build

```bash
# Build the project
npm run build

# Run the built application
npm start
```

## Database

By default, SQLite is used (`prisma/dev.db`). PostgreSQL and MySQL are also supported. Choose your database via `DATABASE_URL` in `.env`:

| Database | `DATABASE_URL` |
|----------|----------------|
| **SQLite** (default) | `file:./dev.db` |
| **PostgreSQL** | `postgresql://user:pass@localhost:5432/favoritpro` |
| **MySQL** | `mysql://user:pass@localhost:3306/favoritpro` |

Database commands:

```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Create and apply migration
npm run db:reset     # Reset the database
```

## Project Structure

```
favorit-pro/
├── prisma/
│   ├── schema.prisma          # Database schema (8 models)
│   └── seed.ts                # Database seeding
├── public/
│   ├── manifest.json          # PWA manifest
│   └── robots.txt             # SEO robots.txt
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with providers
│   │   ├── page.tsx           # Main page with sections
│   │   └── api/               # REST API routes
│   │       ├── matches/       # /api/matches
│   │       ├── experts/       # /api/experts
│   │       ├── predictions/   # /api/predictions
│   │       ├── news/          # /api/news
│   │       ├── search/        # /api/search?q=
│   │       └── subscribe/     # /api/subscribe (POST)
│   ├── components/            # 38+ UI components
│   ├── hooks/
│   │   ├── use-api.ts         # React Query API hooks
│   │   ├── use-toast.ts       # Toast notifications
│   │   ├── use-mobile.ts      # Mobile device detection
│   ├── stores/
│   │   └── app-store.ts       # Zustand store (bet slip, favorites, theme)
│   ├── types/
│   │   └── navigation.ts      # Navigation types
│   ├── lib/
│   │   ├── data.ts            # Mock data
│   │   ├── db.ts              # Prisma client
│   │   └── utils.ts           # Utilities (cn)
│   └── providers/
│       └── query-provider.tsx # React Query provider
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── components.json
```

## API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/matches` | GET | List matches with optional status/sport filters |
| `/api/experts` | GET | List experts with optional sport filter |
| `/api/predictions` | GET | List expert predictions |
| `/api/news` | GET | List news articles |
| `/api/search` | GET | Search across matches, experts, predictions |
| `/api/subscribe` | POST | Subscribe/unsubscribe to expert tier |

## Deployment

The project is configured with `output: "standalone"` in `next.config.ts`, allowing deployment on any platform that supports Node.js. Below are instructions for 4 major platforms.

### Platform Comparison

| Platform | Difficulty | Price | Database | Best For |
|----------|------------|-------|----------|----------|
| **Vercel** | Very easy | Free (Hobby) | PostgreSQL (Neon, Supabase) | Quick launch, prototypes |
| **Railway** | Easy | $5/mo | PostgreSQL (built-in) | Production without server management |
| **Docker** | Medium | Depends on host | SQLite / PostgreSQL | Containerization, CI/CD |
| **VPS** | Harder | From $3/mo (DigitalOcean, Hetzner) | SQLite / PostgreSQL | Full control, production |

---

### 1. Vercel (Recommended for Quick Launch)

Vercel — creators of Next.js, best compatibility and automatic optimization.

**Step 1:** Connect the repository
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

Or via web interface: [vercel.com/new](https://vercel.com/new) → Import Git Repository → select your repo.

**Step 2:** Set up the database
Vercel does not support SQLite. Connect PostgreSQL via [Neon](https://neon.tech) or [Supabase](https://supabase.com):
```
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/favoritpro?sslmode=require"
```

**Step 3:** Add environment variables in Vercel Dashboard:
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=https://your-domain.vercel.app
NODE_ENV=production
```

**Step 4:** Configure Prisma for production. Add to `package.json` scripts:
```json
"vercel-build": "prisma generate && prisma migrate deploy && next build"
```

**Step 5:** Redeploy. The app will be available at `https://your-project.vercel.app`.

---

### 2. Railway

Railway provides built-in PostgreSQL and automatic deployment from GitHub.

**Step 1:** Sign up at [railway.app](https://railway.app) and click "New Project" → "Deploy from GitHub repo".

**Step 2:** Add a PostgreSQL service: "New" → "Database" → "Add PostgreSQL". Railway will automatically add `DATABASE_URL` to environment variables.

**Step 3:** Configure environment variables in Railway Dashboard:
```
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=<auto-generated Railway URL>
NODE_ENV=production
```

**Step 4:** Ensure `package.json` has these commands:
```json
"build": "prisma generate && prisma migrate deploy && next build",
"start": "next start"
```

Railway will auto-detect the Next.js project and run it.

**Step 5:** The app will be available at `https://your-project.up.railway.app`.

---

### 3. Docker (Containerization)

Create a `Dockerfile` in the project root:

```dockerfile
# === Builder stage ===
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# === Runner stage ===
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
RUN npm ci --omit=dev && npx prisma generate

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.js"]
```

Create `.dockerignore`:
```
node_modules
.next
.git
*.md
.env
```

**Build and run:**
```bash
# Build the image
docker build -t favorit-pro .

# Run with PostgreSQL
docker run -d -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/favoritpro" \
  -e NEXTAUTH_SECRET="your-secret" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  favorit-pro
```

**Docker Compose** (with PostgreSQL):
```yaml
version: "3.8"
services:
  app:
    build: .
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: postgresql://favorit:secret@db:5432/favoritpro
      NEXTAUTH_SECRET: your-secret-here
      NEXTAUTH_URL: http://localhost:3000
      NODE_ENV: production
    depends_on: [db]
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: favorit
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: favoritpro
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

```bash
docker compose up -d --build
```

---

### 4. VPS (DigitalOcean, Hetzner, Aeza)

Full control over the server. Recommended for production with high traffic.

**Step 1:** Rent a VPS (Ubuntu 22.04+, 1 CPU, 1 GB RAM minimum).

**Step 2:** Connect to the server and install dependencies:
```bash
ssh root@your-server-ip

# Update the system
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs nginx certbot python3-certbot-nginx

# Install PM2 for process management
npm i -g pm2
```

**Step 3:** Clone the project and set up:
```bash
cd /var/www
git clone https://github.com/your-username/favorit-pro.git
cd favorit-pro

npm ci
cp .env.example .env
# Edit .env (nano .env)
```

**Step 4:** Configure `.env`:
```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="<openssl rand -base64 32>"
NEXTAUTH_URL="http://your-domain.com"
NODE_ENV=production
PORT=3000
```

**Step 5:** Build and run:
```bash
npx prisma generate
npx prisma db push
npm run build

# Run via PM2
pm2 start npm --name "favorit-pro" -- start
pm2 save
pm2 startup
```

**Step 6:** Configure Nginx as a reverse proxy:
```bash
nano /etc/nginx/sites-available/favorit-pro
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/favorit-pro /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

**Step 7:** Set up HTTPS via Let's Encrypt:
```bash
certbot --nginx -d your-domain.com
```

---

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | Database connection string | `file:./dev.db` or `postgresql://...` |
| `NEXTAUTH_SECRET` | Yes | Session secret key | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Yes | Application URL | `https://your-domain.com` |
| `NODE_ENV` | No | Runtime environment | `production` |
| `PORT` | No | Server port | `3000` |

### Database Migration on Deployment

After each code update, apply migrations:
```bash
npx prisma migrate deploy
```

> **Important:** Use `migrate deploy` (not `db push`) in production — this only applies committed migrations.

### Post-Deployment Verification

1. Open `https://your-domain.com` — the main page should load
2. Check the API: `curl https://your-domain.com/api/matches` — should return JSON
3. Initialize the DB: `npx prisma db push`
4. Navigate to: Sports, Experts, Calculator — everything should work
5. Test mobile view via Chrome DevTools

## Roadmap

- [x] Main SPA with 6 sections
- [x] Prisma database with 8 models
- [x] 6 REST API routes
- [x] Bet slip (single/express/system)
- [x] Bet calculator
- [x] User cabinet
- [x] Subscription tiers (Free/Pro/VIP)
- [x] Real-time animated odds
- [x] Achievement system
- [x] API search
- [x] Team comparison
- [x] Match timeline
- [x] Daily tips
- [x] PWA support
- [x] React Query integration
- [x] Form validation (react-hook-form + zod)
- [ ] NextAuth authentication
- [ ] Payment integration for subscriptions
- [ ] Admin panel for content management

---

## Author

**Dupley Maxim Igorevich**

This project is the intellectual property of Dupley Maxim Igorevich. All rights to the source code, design, content, and materials belong to the author.

---

## License

This project is the intellectual property of Dupley Maxim Igorevich. Terms of use are described in the [LICENCE](./LICENCE) file.

---

<div align="center">

**FavoritPro** — © 2025–2026 Dupley Maxim Igorevich. All rights reserved.

</div>

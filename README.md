<div align="center">

# ФаворитПро

### Профессиональные прогнозы на спортивные события

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-new--york-black)](https://ui.shadcn.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.11-2d3748?logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](./LICENCE)

---

**Автор:** Дуплей Максим Игоревич

**Интеллектуальная собственность:** Дуплей Максим Игоревич

</div>

---

## Языковые версии

- [Русская версия](README_RU.md)
- [English version](README_EN.md)

---

## О проекте

**ФаворитПро** — это комплексная веб-платформа для профессиональных прогнозов на спортивные события. Проект объединяет систему экспертных прогнозов, интерактивные матчи с коэффициентами, калькулятор ставок, пользовательский кабинет с системой подписок, геймификацию с достижениями и аналитическую статистику.

Платформа поддерживает 6 видов спорта: футбол, хоккей, баскетбол, теннис, киберспорт и волейбол.

## Ключевые возможности

- **6 видов спорта** — футбол, хоккей, баскетбол, теннис, киберспорт, волейбол
- **Живые матчи** — отслеживание матчей в реальном времени с анимацией коэффициентов
- **Прогнозы экспертов** — аналитика от 6 экспертов с рейтингом и статистикой
- **Купон ставок** — одинар, экспресс, система с расчётом прибыли и ROI
- **Калькулятор ставок** — расчёт потенциального выигрыша для всех типов ставок
- **Пользовательский кабинет** — 4 вкладки: активность, избранное, подписки, настройки
- **Система подписок** — 3 тарифа: Free, Pro (1490₽), VIP (3990₽)
- **10 достижений** — система геймификации с бейджами
- **Горячие серии** — отслеживание выигрышных серий экспертов
- **Сравнение команд** — визуальное сравнение статистики команд
- **Таймлайн матчей** — лента событий матча (голы, карточки, замены)
- **Ежедневные советы** — карусель советов по ставкам с автопрокруткой
- **Уведомления** — колокольчик с уведомлениями о победах, LIVE, прогнозах
- **Поиск** — живой поиск по матчам, экспертам и прогнозам
- **Тёмная и светлая тема** — переключение через Zustand
- **Адаптивный интерфейс** — полная поддержка мобильных устройств
- **PWA** — манифест, мета-теги, установка на устройство
- **Glassmorphism** — современный дизайн с backdrop-blur эффектами

## Быстрый старт

```bash
git clone https://github.com/your-username/favorit-pro.git
cd favorit-pro
npm install
npm run db:generate
npm run db:push
npm run dev
```

Приложение запустится на порту 3000.

## Конфигурация

### База данных

По умолчанию используется SQLite (файл `prisma/dev.db`). Поддерживаются PostgreSQL и MySQL. Выберите БД через `DATABASE_URL` в `.env`:

| База данных | `DATABASE_URL` |
|-------------|----------------|
| **SQLite** (по умолчанию) | `file:./dev.db` |
| **PostgreSQL** | `postgresql://user:pass@localhost:5432/favoritpro` |
| **MySQL** | `mysql://user:pass@localhost:3306/favoritpro` |

Команды для работы с БД:

```bash
npm run db:generate  # Сгенерировать клиент Prisma
npm run db:push      # Применить схему к БД
npm run db:migrate   # Создать и применить миграцию
npm run db:reset     # Сбросить БД
```

## Технологии

| Технология | Назначение |
|------------|------------|
| **Next.js 16** | React-фреймворк с App Router |
| **TypeScript 5** | Статическая типизация |
| **Tailwind CSS 4** | Утилитарные CSS-стили |
| **shadcn/ui** | Компоненты интерфейса (New York style) |
| **Prisma 6** | ORM для работы с БД (SQLite/PostgreSQL/MySQL) |
| **Zustand 5** | Управление состоянием с localStorage |
| **React Query 5** | Кэширование и управление API-запросами |
| **Recharts 2** | Интерактивные графики и диаграммы |
| **Framer Motion 12** | Анимации и переходы |
| **React Hook Form + Zod** | Валидация форм |
| **TanStack React Query** | Кеширование и управление данными |
| **next-auth** | Аутентификация |
| **next-intl** | Интернационализация |

## Структура проекта

```
favorit-pro/
├── prisma/
│   ├── schema.prisma          # Схема БД (8 моделей)
│   └── seed.ts                # Сидирование данными
├── public/
│   ├── manifest.json          # PWA манифест
│   └── robots.txt             # SEO robots.txt
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Корневой layout с провайдерами
│   │   ├── page.tsx           # Главная страница с секциями
│   │   └── api/               # REST API маршруты
│   │       ├── matches/       # /api/matches
│   │       ├── experts/       # /api/experts
│   │       ├── predictions/   # /api/predictions
│   │       ├── news/          # /api/news
│   │       ├── search/        # /api/search?q=
│   │       └── subscribe/     # /api/subscribe (POST)
│   ├── components/            # 38+ UI-компонентов
│   ├── hooks/
│   │   ├── use-api.ts         # React Query API-хуки
│   │   ├── use-toast.ts       # Уведомления
│   │   └── use-mobile.ts      # Определение мобильного устройства
│   ├── stores/
│   │   └── app-store.ts       # Zustand store (купон, избранное, тема)
│   ├── types/
│   │   └── navigation.ts      # Типы навигации
│   ├── lib/
│   │   ├── data.ts            # Моковые данные
│   │   ├── db.ts              # Prisma клиент
│   │   └── utils.ts           # Утилиты (cn)
│   └── providers/
│       └── query-provider.tsx # React Query провайдер
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── components.json
```

## Развёртывание (Deployment)

Проект настроен с `output: "standalone"` в `next.config.ts`, что позволяет разворачивать его на любой платформе, поддерживающей Node.js. Ниже приведены инструкции для 4 основных платформ.

### Сравнение платформ

| Платформа | Сложность | Цена | БД | Для кого |
|-----------|-----------|------|-----|----------|
| **Vercel** | Очень легко | Бесплатно (Hobby) | PostgreSQL (Neon, Supabase) | Быстрый запуск, прототипы |
| **Railway** | Легко | $5/мес | PostgreSQL (встроенная) | Продакшен без настройки сервера |
| **Docker** | Средне | Зависит от хоста | SQLite / PostgreSQL | Контейнеризация, CI/CD |
| **VPS** | Сложнее | От $3/мес (Aeza, DigitalOcean) | SQLite / PostgreSQL | Полный контроль, продакшен |

---

### 1. Vercel (рекомендуется для быстрого запуска)

Vercel — создатели Next.js, лучшая совместимость и автоматическая оптимизация.

**Шаг 1:** Подключите репозиторий
```bash
# Установите Vercel CLI
npm i -g vercel

# Войдите в аккаунт
vercel login

# Разверните проект
vercel --prod
```

Или через веб-интерфейс: [vercel.com/new](https://vercel.com/new) → Import Git Repository → выберите репозиторий.

**Шаг 2:** Настройте базу данных
Vercel не поддерживает SQLite. Подключите PostgreSQL через [Neon](https://neon.tech) или [Supabase](https://supabase.com):
```
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/favoritpro?sslmode=require"
```

**Шаг 3:** Добавьте переменные окружения в Vercel Dashboard:
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=<сгенерируйте: openssl rand -base64 32>
NEXTAUTH_URL=https://ваш-домен.vercel.app
NODE_ENV=production
```

**Шаг 4:** Настройте Prisma для продакшена. В `package.json` добавьте в `scripts`:
```json
"vercel-build": "prisma generate && prisma migrate deploy && next build"
```

**Шаг 5:** Перезапустите деплой. Приложение будет доступно по `https://ваш-проект.vercel.app`.

---

### 2. Railway

Railway предоставляет встроенную PostgreSQL и автоматический деплой из GitHub.

**Шаг 1:** Зарегистрируйтесь на [railway.app](https://railway.app) и нажмите "New Project" → "Deploy from GitHub repo".

**Шаг 2:** Добавьте сервис PostgreSQL в проект: "New" → "Database" → "Add PostgreSQL". Railway автоматически добавит `DATABASE_URL` в переменные окружения.

**Шаг 3:** Настройте переменные окружения в Railway Dashboard:
```
NEXTAUTH_SECRET=<сгенерируйте: openssl rand -base64 32>
NEXTAUTH_URL=<автоматически сгенерированный Railway URL>
NODE_ENV=production
```

**Шаг 4:** Убедитесь, что в `package.json` есть команды:
```json
"build": "prisma generate && prisma migrate deploy && next build",
"start": "next start"
```

Railway автоматически определит Next.js проект и запустит его.

**Шаг 5:** Приложение будет доступно по `https://ваш-проект.up.railway.app`.

---

### 3. Docker (контейнеризация)

Создайте `Dockerfile` в корне проекта:

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

Создайте `.dockerignore`:
```
node_modules
.next
.git
*.md
.env
```

**Сборка и запуск:**
```bash
# Собрать образ
docker build -t favorit-pro .

# Запустить с PostgreSQL
docker run -d -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/favoritpro" \
  -e NEXTAUTH_SECRET="your-secret" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  favorit-pro
```

**Docker Compose** (с PostgreSQL):
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

### 4. VPS (Aeza, DigitalOcean, Hetzner)

Полный контроль над сервером. Рекомендуется для продакшена с большим трафиком.

**Шаг 1:** Арендуйте VPS (Ubuntu 22.04+, 1 CPU, 1 GB RAM минимум).

**Шаг 2:** Подключитесь к серверу и установите зависимости:
```bash
ssh root@your-server-ip

# Обновите систему
apt update && apt upgrade -y

# Установите Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs nginx certbot python3-certbot-nginx

# Установите PM2 для управления процессами
npm i -g pm2
```

**Шаг 3:** Клонируйте проект и настройте:
```bash
cd /var/www
git clone https://github.com/your-username/favorit-pro.git
cd favorit-pro

npm ci
cp .env.example .env
# Отредактируйте .env (nano .env)
```

**Шаг 4:** Настройте `.env`:
```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="<openssl rand -base64 32>"
NEXTAUTH_URL="http://your-domain.com"
NODE_ENV=production
PORT=3000
```

**Шаг 5:** Соберите и запустите:
```bash
npx prisma generate
npx prisma db push
npm run build

# Запустите через PM2
pm2 start npm --name "favorit-pro" -- start
pm2 save
pm2 startup
```

**Шаг 6:** Настройте Nginx как обратный прокси:
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

**Шаг 7:** Настройте HTTPS через Let's Encrypt:
```bash
certbot --nginx -d your-domain.com
```

---

### Переменные окружения

| Переменная | Обязательно | Описание | Пример |
|------------|-------------|----------|--------|
| `DATABASE_URL` | Да | Строка подключения к БД | `file:./dev.db` или `postgresql://...` |
| `NEXTAUTH_SECRET` | Да | Секретный ключ сессий | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Да | URL приложения | `https://your-domain.com` |
| `NODE_ENV` | Нет | Среда выполнения | `production` |
| `PORT` | Нет | Порт сервера | `3000` |

### Миграция базы данных при деплое

После каждого обновления кода применяйте миграции:
```bash
npx prisma migrate deploy
```

> **Важно:** Используйте `migrate deploy` (не `db push`) в продакшене — это применяет только подтверждённые миграции.

### Проверка после деплоя

1. Откройте `https://your-domain.com` — главная страница должна загрузиться
2. Проверьте API: `curl https://your-domain.com/api/matches` — должен вернуть JSON
3. Проверьте БД: `npx prisma db push` (для инициализации)
4. Откройте разделы: Спорт, Эксперты, Калькулятор — всё должно работать
5. Проверьте мобильную версию через Chrome DevTools

## Дорожная карта

- [x] Основная SPA с 6 секциями
- [x] База данных Prisma с 8 моделями
- [x] 6 REST API маршрутов
- [x] Купон ставок (одинар/экспресс/система)
- [x] Калькулятор ставок
- [x] Пользовательский кабинет
- [x] Система подписок (Free/Pro/VIP)
- [x] Анимация коэффициентов в реальном времени
- [x] Система достижений
- [x] Поиск по API
- [x] Сравнение команд
- [x] Таймлайн матчей
- [x] Ежедневные советы
- [x] PWA поддержка
- [x] React Query интеграция
- [x] Валидация форм (react-hook-form + zod)
- [ ] Авторизация через NextAuth
- [ ] Платёжная интеграция для подписок
- [ ] Админ-панель для управления контентом

---

**ФаворитПро** — © 2025–2026 Дуплей Максим Игоревич. Все права защищены.

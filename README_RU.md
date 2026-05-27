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

## О проекте

**ФаворитПро** — это комплексная веб-платформа для профессиональных прогнозов на спортивные события. Проект объединяет систему экспертных прогнозов, интерактивные матчи с коэффициентами в реальном времени, калькулятор ставок, пользовательский кабинет с системой подписок, геймификацию с достижениями и аналитическую статистику. Платформа предназначена для любителей и профессионалов ставок, предоставляя инструменты для анализа и принятия обоснованных решений.

Платформа поддерживает 6 видов спорта: футбол, хоккей, баскетбол, теннис, киберспорт и волейбол.

## Ключевые возможности

- **6 видов спорта** — футбол, хоккей, баскетбол, теннис, киберспорт, волейбол
- **Живые матчи** — отслеживание матчей в реальном времени с анимацией колебаний коэффициентов каждые 5 секунд
- **Прогнозы экспертов** — аналитика от 6 экспертов с рейтингом, ROI, серией побед и историей результатов
- **Купон ставок** — одинар, экспресс, система с расчётом потенциальной прибыли и ROI
- **Калькулятор ставок** — детальный расчёт выигрыша для всех типов ставок с визуализацией
- **Пользовательский кабинет** — 4 вкладки: активность, избранное, подписки, настройки с балансом
- **Система подписок** — 3 тарифа: Free (0₽), Pro (1490₽/мес), VIP (3990₽/мес)
- **10 достижений** — геймифицированная система с бейджами за прогресс
- **Горячие серии** — карусель экспертов с серией из 3+ побед подряд с огненным дизайном
- **Сравнение команд** — интерактивное сравнение статистики двух команд с визуальными шкалами
- **Таймлайн матчей** — вертикальная лента событий матча (голы, карточки, замены) с минутами
- **Ежедневные советы** — автоматически вращающаяся карусель из 5 советов по ставкам
- **Уведомления** — колокольчик с 5 типами уведомлений (победа, горячее, LIVE, прогноз)
- **Поиск** — живой поиск с debounce 300мс по матчам, экспертам и прогнозам через API
- **Экспресс дня** — рекомендуемый комбинированный прогноз с общим коэффициентом и выигрышем
- **Тёмная и светлая тема** — переключение через Zustand store с сохранением в localStorage
- **Адаптивный интерфейс** — полная поддержка мобильных устройств с нижней навигацией
- **PWA** — манифест, мета-теги, установка на устройство как нативное приложение
- **Glassmorphism** — современный дизайн с backdrop-blur, hover-эффектами и градиентами

## Разделы платформы

| # | Раздел | Описание |
|---|--------|----------|
| 1 | **Главная** | Герой со статистикой, живой тикер, горячие серии, живые матчи, экспресс дня, прогнозы экспертов, ежедневные советы, новости |
| 2 | **Спорт** | Категории видов спорта с количеством матчей, фильтр по видам спорта |
| 3 | **Эксперты** | Таблица рейтинга экспертов с винрейтом, ROI, сериями побед и последними результатами |
| 4 | **Статистика** | Месячная статистика, разбивка по видам спорта, графики производительности (столбчатые, линейные, круговые) |
| 5 | **Новости** | Карточки спортивных новостей с категориями, изображениями и временем чтения |
| 6 | **Результаты** | Завершённые матчи с итоговыми счётчиками и результатами прогнозов |
| 7 | **Калькулятор** | Калькулятор ставок с вкладками одинар/экспресс/система, ввод суммы, отображение прибыли/ROI |

## Система купона ставок

| Вкладка | Описание |
|---------|----------|
| **Одинар** | Индивидуальные ставки с суммой и потенциальным выигрышем |
| **Экспресс** | Комбинированные ставки — коэффициенты перемножаются, все должны выиграть |
| **Система** | Частичное покрытие системы (например, 2/3, 2/4) |

Нажатие на коэффициент любого матча добавляет выбор в купон с toast-уведомлением.

## Достижения

| # | Достижение | Требование |
|---|-----------|------------|
| 1 | Первая ставка | Разместите первую ставку |
| 2 | Первая победа | Выиграйте первый прогноз |
| 3 | Горячая серия | Подпишитесь на эксперта с серией 5+ побед |
| 4 | Коллекционер | Добавьте 5 матчей в избранное |
| 5 | Аналитик | Просмотрите детальный анализ матча |
| 6 | Подписчик | Подпишитесь на эксперта |
| 7 | Pro-пользователь | Перейдите на тариф Pro |
| 8 | VIP-участник | Перейдите на тариф VIP |
| 9 | Активный игрок | 30 дней активности |
| 10 | Эксперт | Отслеживайте 100+ прогнозов |

## Технологии

| Технология | Версия | Назначение |
|------------|--------|------------|
| **Next.js** | 16 | React-фреймворк с App Router, SSR и оптимизацией |
| **TypeScript** | 5 | Статическая типизация для надёжности кода |
| **Tailwind CSS** | 4 | Утилитарные CSS-стили для быстрой разработки UI |
| **shadcn/ui** | — | Компоненты интерфейса в стиле New York |
| **Prisma** | 6.11 | ORM с поддержкой SQLite/PostgreSQL/MySQL |
| **Zustand** | 5 | Лёгкое управление состоянием с персистентностью в localStorage |
| **React Query** | 5.82 | Кэширование и управление API-запросами |
| **Recharts** | 2 | Интерактивные графики и диаграммы для визуализации данных |
| **Framer Motion** | 12 | Плавные анимации и переходы |
| **React Hook Form** | 7.60 | Управление формами |
| **Zod** | 4.0 | Валидация по схеме |
| **next-auth** | 4.24 | Аутентификация |
| **next-intl** | 4.3 | Интернационализация |

## Установка и запуск

### Предварительные требования

- **Node.js** версии 18 или выше (рекомендуется 20+)
- **npm**, **yarn**, **pnpm** или **bun** в качестве пакетного менеджера

### Установка

```bash
# Клонировать репозиторий
git clone https://github.com/your-username/favorit-pro.git
cd favorit-pro

# Установить зависимости
npm install

# Сгенерировать клиент Prisma
npm run db:generate

# Применить схему к базе данных
npm run db:push

# Запустить в режиме разработки
npm run dev
```

Приложение будет доступно по адресу `http://localhost:3000`.

### Сборка для продакшена

```bash
# Сборка проекта
npm run build

# Запуск собранного приложения
npm start
```

## База данных

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
│   │   ├── use-mobile.ts      # Определение мобильного устройства
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

## API маршруты

| Эндпоинт | Метод | Описание |
|----------|-------|----------|
| `/api/matches` | GET | Список матчей с фильтрами по статусу/виду спорта |
| `/api/experts` | GET | Список экспертов с фильтром по виду спорта |
| `/api/predictions` | GET | Список прогнозов экспертов |
| `/api/news` | GET | Список новостных статей |
| `/api/search` | GET | Поиск по матчам, экспертам, прогнозам |
| `/api/subscribe` | POST | Подписка/отписка от тарифа эксперта |

## Схема базы данных

Проект использует Prisma ORM с 8 моделями:

| Модель | Описание |
|--------|----------|
| **Sport** | Вид спорта (футбол, хоккей и т.д.) |
| **Match** | Матч с коэффициентами, счётом, статусом |
| **Expert** | Эксперт с винрейтом, ROI, серией |
| **Prediction** | Прогноз эксперта на матч |
| **User** | Пользователь с балансом и подпиской |
| **Like** | Лайки прогнозов пользователями |
| **Subscription** | Подписки пользователей на экспертов |
| **NewsArticle** | Новостные статьи |

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

## Автор

**Дуплей Максим Игоревич**

Данный проект является интеллектуальной собственностью Дуплей Максима Игоревича. Все права на программный код, дизайн, контент и материалы принадлежат автору.

---

## Лицензия

Данный проект является интеллектуальной собственностью Дуплей Максима Игоревича. Условия использования описаны в файле [LICENCE](./LICENCE).

---

<div align="center">

**ФаворитПро** — © 2025–2026 Дуплей Максим Игоревич. Все права защищены.

</div>

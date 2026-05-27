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

Проект настроен с `output: "standalone"` в `next.config.ts`, что позволяет разворачивать его на любой платформе с Node.js или в Docker-контейнере.

### Таблица быстрого выбора

| # | Платформа | Сложность | Цена | БД | Трафик | Время |
|---|-----------|-----------|------|-----|--------|-------|
| 1 | **Vercel + Supabase** | Легко | Бесплатно (Hobby) | PostgreSQL | До 100K запросов/мес | 5 мин |
| 2 | **Railway** | Легко | $5/мес | PostgreSQL / SQLite | До 500 часов/мес | 3 мин |
| 3 | **Render** | Средне | Бесплатно / $7/мес | PostgreSQL | Ограничен на free | 10 мин |
| 4 | **Netlify** | Легко | Бесплатно (100 GB bandwidth) | Внешняя БД | 100 GB/мес | 5 мин |
| 5 | **VPS + Docker** | Средне | От $3/мес | SQLite / PostgreSQL | Зависит от сервера | 30 мин |
| 6 | **Docker Swarm** | Сложно | От $10/мес (3 ноды) | PostgreSQL (репликация) | Высокий | 1-2 часа |
| 7 | **Yandex Cloud** | Средне | От ₽2000/мес | PostgreSQL / SQLite | Высокий | 20 мин |

### Как выбрать платформу?

| Критерий | Рекомендация |
|----------|-------------|
| **Бесплатно для портфолио** | Vercel + Supabase (Neon) |
| **Быстрый MVP / прототип** | Railway |
| **Продакшен без администрирования** | Railway / Render |
| **Полный контроль и низкая цена** | VPS (Aeza, Hetzner) |
| **Высокий трафик и отказоустойчивость** | Docker Swarm / Yandex Cloud |
| **Статический фронтенд + внешний API** | Netlify |
| **Российский хостинг (152-ФЗ)** | Yandex Cloud / VPS в РФ |

---

### SQLite vs PostgreSQL — когда что использовать

| Критерий | SQLite | PostgreSQL |
|----------|--------|------------|
| **Размер данных** | До 10 GB | Без ограничений |
| **Конкурентные записи** | 1 писатель | Множество писателей |
| **Бэкапы** | Копия файла | pg_dump, репликация |
| **Масштабирование** | Нет | Репликация, шардинг |
| **Стоимость** | Бесплатно (файл) | От $5/мес (managed) |
| **Подходит для** | VPS, Docker (малый трафик) | Vercel, Railway, продакшен |

**Миграция SQLite → PostgreSQL:**
```bash
# 1. Экспорт из SQLite
sqlite3 prisma/dev.db ".dump" > backup.sql

# 2. Создайте PostgreSQL БД и примените схему
npx prisma db push

# 3. Конвертируйте и импортируйте данные (через pgloader или вручную)
# Или используйте prisma migrate для чистой схемы и сидирования
npm run db:seed
```

> **Совет:** Начните с SQLite для разработки. При переходе на продакшен — переключитесь на PostgreSQL и измените `DATABASE_URL` в `.env`.

---

### 1. Vercel + Supabase

**Шаг 1:** Создайте PostgreSQL в [Supabase](https://supabase.com) → New Project → получите `DATABASE_URL`.

**Шаг 2:** Деплой на Vercel:
```bash
npm i -g vercel && vercel login && vercel --prod
```

**Шаг 3:** Добавьте переменные окружения в Vercel Dashboard:
```
DATABASE_URL=postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres?sslmode=require
NEXTAUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=https://ваш-проект.vercel.app
NODE_ENV=production
```

**Шаг 4:** Добавьте в `package.json`:
```json
"vercel-build": "prisma generate && prisma migrate deploy && next build"
```

---

### 2. Railway (с SQLite)

Railway поддерживает SQLite через persistent volumes.

**Шаг 1:** [railway.app](https://railway.app) → New Project → Deploy from GitHub.

**Шаг 2:** Для SQLite: добавьте Volume в Settings → Volumes → Mount Path: `/app/prisma`.

**Шаг 3:** Переменные окружения:
```
DATABASE_URL=file:/app/prisma/dev.db
NEXTAUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=<Railway URL>
NODE_ENV=production
```

**Шаг 4:** Railway автоматически запустит `npm run build` и `npm start`.

---

### 3. Render

**Шаг 1:** Зарегистрируйтесь на [render.com](https://render.com) → New Web Service → подключите репозиторий.

**Шаг 2:** Настройки сборки:
- **Build Command:** `npm ci && npx prisma generate && npx prisma migrate deploy && npm run build`
- **Start Command:** `next start`
- **Environment:** Node

**Шаг 3:** Добавьте переменные окружения в Render Dashboard:
```
DATABASE_URL=postgresql://...  # или file:./prisma/dev.db с диском
NEXTAUTH_SECRET=<secret>
NEXTAUTH_URL=https://ваш-проект.onrender.com
NODE_ENV=production
```

**Шаг 4:** Для SQLite на Render: добавьте Persistent Disk в Dashboard → Mount Path: `/app/prisma`.

> **Важно:** На бесплатном тарифе Render "засыпает" через 15 мин бездействия. Первый запрос после простоя будет медленным (~30 сек).

---

### 4. Netlify

Netlify поддерживает Next.js через @netlify/plugin-nextjs.

**Шаг 1:** Установите плагин:
```bash
npm i -D @netlify/plugin-nextjs
```

**Шаг 2:** Создайте `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

**Шаг 3:** Деплой через [netlify.com](https://netlify.com) → Import Git Repository.

**Шаг 4:** Переменные окружения в Netlify Dashboard:
```
DATABASE_URL=postgresql://...  # Netlify не поддерживает SQLite
NEXTAUTH_SECRET=<secret>
NEXTAUTH_URL=https://ваш-проект.netlify.app
NODE_ENV=production
```

> **Ограничение:** Netlify — серверлесс-платформа. API-маршруты работают как serverless functions с лимитом 10 сек выполнения. Rate limiting через in-memory Map не сохраняется между запросами.

---

### 5. VPS + Docker

**Шаг 1:** Арендуйте VPS (Ubuntu 22.04+, 1 CPU, 1 GB RAM).

**Шаг 2:** Установите Docker:
```bash
curl -fsSL https://get.docker.com | sh
usermod -aG docker $USER
```

**Шаг 3:** Создайте `docker-compose.yml`:
```yaml
version: "3.8"
services:
  app:
    build: .
    ports: ["3000:3000"]
    restart: unless-stopped
    environment:
      DATABASE_URL: postgresql://favorit:secret@db:5432/favoritpro
      NEXTAUTH_SECRET: your-secret-here
      NEXTAUTH_URL: http://your-domain.com
      NODE_ENV: production
    depends_on: [db]
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: favorit
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: favoritpro
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

**Шаг 4:** Запуск:
```bash
docker compose up -d --build
```

**Шаг 5:** Nginx + HTTPS:
```bash
apt install -y nginx certbot python3-certbot-nginx

# Создайте конфиг /etc/nginx/sites-available/favorit-pro
server {
    listen 80;
    server_name your-domain.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

ln -s /etc/nginx/sites-available/favorit-pro /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
certbot --nginx -d your-domain.com
```

---

### 6. Docker Swarm (высокая доступность)

Для продакшена с 3+ серверами.

**Шаг 1:** Инициализируйте Swarm на master-ноде:
```bash
docker swarm init --advertise-addr <MASTER_IP>
```

**Шаг 2:** Подключите worker-ноды (команда из `docker swarm join-token worker`).

**Шаг 3:** Создайте `docker-stack.yml`:
```yaml
version: "3.8"
services:
  app:
    image: favorit-pro:latest
    deploy:
      replicas: 3
      restart_policy:
        condition: on-failure
      update_config:
        parallelism: 1
        delay: 10s
    environment:
      DATABASE_URL: postgresql://favorit:secret@db:5432/favoritpro
      NEXTAUTH_SECRET: your-secret-here
      NEXTAUTH_URL: https://your-domain.com
      NODE_ENV: production
    ports: ["3000:3000"]
    depends_on: [db]
  db:
    image: postgres:16-alpine
    deploy:
      placement:
        constraints: [node.role == manager]
    environment:
      POSTGRES_USER: favorit
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: favoritpro
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

**Шаг 4:** Деплой:
```bash
docker stack deploy -c docker-stack.yml favorit-pro
docker stack ps favorit-pro  # Проверка
```

---

### 7. Yandex Cloud

**Шаг 1:** Создайте Compute Instance (Ubuntu 22.04, 2 vCPU, 4 GB RAM) в [console.cloud.yandex.ru](https://console.cloud.yandex.ru).

**Шаг 2:** Подключитесь и установите Docker:
```bash
ssh yc-user@<EXTERNAL_IP>
curl -fsSL https://get.docker.com | sh
```

**Шаг 3:** (Опционально) Создайте Managed PostgreSQL в Yandex Cloud → получите строку подключения.

**Шаг 4:** Деплой через docker-compose (как в варианте 5) или через Container Registry:
```bash
# Соберите и отправьте образ в Yandex Container Registry
yc container registry create --name favorit-pro
docker build -t cr.yandex/<registry-id>/favorit-pro:latest .
docker push cr.yandex/<registry-id>/favorit-pro:latest
```

**Шаг 5:** Переменные окружения:
```
DATABASE_URL=postgresql://favorit:pass@<pg-host>:6432/favoritpro
NEXTAUTH_SECRET=<secret>
NEXTAUTH_URL=https://your-domain.ru
NODE_ENV=production
```

> **Преимущество:** Данные в РФ (152-ФЗ), встроенная DDoS-защита, SSL-сертификаты от Let's Encrypt через Certificate Manager.

---

### Переменные окружения

#### Обязательные

| Переменная | Описание | Пример |
|------------|----------|--------|
| `DATABASE_URL` | Строка подключения к БД | `file:./dev.db` или `postgresql://...` |
| `NEXTAUTH_SECRET` | Секретный ключ сессий | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | URL приложения | `https://your-domain.com` |

#### Опциональные

| Переменная | По умолчанию | Описание |
|------------|-------------|----------|
| `NODE_ENV` | `development` | Среда: `production` / `development` |
| `PORT` | `3000` | Порт сервера |
| `DEFAULT_LOCALE` | `ru` | Язык по умолчанию |
| `SOCKET_SERVER_URL` | — | URL Socket.IO сервера для LIVE-обновлений |

---

### Бэкапы базы данных

#### Ручной бэкап

**SQLite:**
```bash
cp prisma/dev.db prisma/dev.backup.$(date +%Y%m%d).db
```

**PostgreSQL:**
```bash
pg_dump -U favorit -h localhost favoritpro > backup.$(date +%Y%m%d).sql
```

#### Автоматический бэкап (cron)

**SQLite (VPS):**
```bash
# Добавьте в crontab: crontab -e
0 3 * * * cp /var/www/favorit-pro/prisma/dev.db /backups/dev.$(date +\%Y\%m\%d).db
```

**PostgreSQL (VPS):**
```bash
0 3 * * * pg_dump -U favorit favoritpro > /backups/db.$(date +\%Y\%m\%d).sql
```

**PostgreSQL (Docker):**
```bash
docker exec -t <container_name> pg_dump -U favorit favoritpro > backup.sql
```

> **Рекомендация:** Храните бэкапы на отдельном диске или в облаке (S3, Yandex Object Storage). Удаляйте бэкапы старше 30 дней.

---

### Мониторинг (Prometheus + Grafana)

**Шаг 1:** Добавьте в `docker-compose.yml`:
```yaml
  prometheus:
    image: prom/prometheus:latest
    ports: ["9090:9090"]
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prom_data:/prometheus

  grafana:
    image: grafana/grafana:latest
    ports: ["3001:3000"]
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
    volumes:
      - grafana_data:/var/lib/grafana
    depends_on: [prometheus]

volumes:
  prom_data:
  grafana_data:
```

**Шаг 2:** Создайте `prometheus.yml`:
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'favorit-pro'
    static_configs:
      - targets: ['app:3000']
```

**Шаг 3:** Откройте Grafana на `http://your-domain:3001` (логин: `admin`, пароль: `admin`). Добавьте Prometheus как источник данных и импортируйте дашборд [Next.js Monitoring](https://grafana.com/grafana/dashboards).

---

### CI/CD через GitHub Actions

Создайте `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma client
        run: npx prisma generate

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}

      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: root
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/favorit-pro
            git pull origin main
            npm ci
            npx prisma generate
            npx prisma migrate deploy
            pm2 restart favorit-pro
```

> **Настройка:** Добавьте Secrets в GitHub Repository → Settings → Secrets and variables: `DATABASE_URL`, `NEXTAUTH_SECRET`, `VPS_HOST`, `SSH_PRIVATE_KEY`.

---

### Чеклист деплоя

- [ ] Репозиторий подключён к платформе (Vercel, Railway, Render и т.д.)
- [ ] Переменные окружения настроены: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- [ ] База данных создана и миграции применены: `npx prisma migrate deploy`
- [ ] Сидирование данных выполнено: `npm run db:seed`
- [ ] Домен подключён и HTTPS настроен (сертификат Let's Encrypt)
- [ ] API отвечает: `curl https://your-domain.com/api/matches` → JSON
- [ ] Все разделы работают: Главная, Спорт, Эксперты, Калькулятор, Кабинет
- [ ] Мобильная версия проверена (Chrome DevTools + реальное устройство)
- [ ] Бэкапы настроены (cron или автоматические)
- [ ] Мониторинг подключён (Grafana / Sentry / LogRocket)
- [ ] Rate limiting работает (проверьте `/api/search` с быстрыми запросами)
- [ ] PWA работает (установка на устройство, manifest.json загружается)

---

### Troubleshooting + Rollback

#### Проблема: Приложение не запускается
```bash
# Проверьте логи
pm2 logs favorit-pro        # VPS + PM2
docker compose logs -f      # Docker
vercel logs                 # Vercel

# Проверьте переменные окружения
echo $DATABASE_URL
echo $NEXTAUTH_SECRET
```

#### Проблема: Ошибка подключения к БД
```bash
# Проверьте доступность БД
pg_isready -h localhost -p 5432  # PostgreSQL
sqlite3 prisma/dev.db "SELECT 1;" # SQLite

# Примените миграции заново
npx prisma migrate reset --force
npx prisma migrate deploy
npm run db:seed
```

#### Проблема: Rate limiting блокирует все запросы
```bash
# In-memory rate limiter сбрасывается при рестарте
pm2 restart favorit-pro   # VPS
docker compose restart    # Docker
```

#### Проблема: 500 Internal Server Error
```bash
# Проверьте, что NODE_ENV=production
# Убедитесь, что prisma client сгенерирован
npx prisma generate

# Проверьте, что все необходимые таблицы существуют
npx prisma db push
```

#### Rollback (откат версии)

**VPS + PM2:**
```bash
# Откат к предыдущему коммиту
cd /var/www/favorit-pro
git log --oneline -10           # Найдите нужный commit hash
git reset --hard <commit-hash>
npm ci && npx prisma generate
pm2 restart favorit-pro
```

**Docker:**
```bash
# Откат к предыдущему образу
docker compose down
docker build -t favorit-pro:rollback .  # Или используйте предыдущий тег
docker compose up -d
```

**Vercel:**
```bash
# Через Dashboard: Deployments → выберите предыдущий → Preview → Promote to Production
# Или через CLI:
vercel rollback
```

**Railway:**
```bash
# Dashboard → Deployments → выберите предыдущий → Rollback
```

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

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

# Smart Campus Portal — Admin Panel

Modern, production-ready React admin dashboard for a university management system. Built to be a clean, scalable starting point that a backend team can wire to a real API with minimal UI changes.

## ✨ Features

- **React 18** + **React Router v6** + **Vite**
- **Tailwind CSS** with custom design system (brand palette, soft shadows, rounded UI)
- **Dark / Light** theme with system preference + persistence
- **Recharts** analytics (enrollments, GPA distribution)
- **Axios** HTTP client with interceptors (token, error normalization)
- **Mock data layer** — toggle real API via `VITE_USE_MOCK=false`
- **Glassmorphism login** with **Silk animated background** (React Bits inspired)
- **Reusable UI kit**: Button, Card, Input, Select, Modal, Table, Pagination, Badge, Avatar, Skeleton, EmptyState, Toast
- **Protected routes**, loading states, empty states, validations
- Fully **responsive** with collapsible sidebar

## 🧱 Folder structure

```
src/
├── api/            # Axios client + service files (one per resource)
├── components/
│   ├── ui/         # Reusable primitives
│   ├── layout/     # Sidebar, Navbar
│   ├── dashboard/  # Dashboard widgets
│   └── backgrounds/# Silk animated background
├── context/        # Auth, Theme, Toast providers
├── hooks/          # useAuth, useTheme, useToast, useDebounce
├── layouts/        # AdminLayout
├── pages/          # Login, Dashboard, Users, Grades, Courses, Notifications, Settings, NotFound
├── routes/         # AppRoutes, ProtectedRoute
├── utils/          # constants, formatters, validators
├── App.jsx
└── main.jsx
```

## 🚀 Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

Open <http://localhost:5173>. Use the demo credentials:

```
email:    admin@campus.edu
password: admin123
```

## 🔌 Connecting the backend

The UI layer never imports `axios` directly — it consumes service modules in `src/api/`. To switch from mock data to real APIs:

1. Set `VITE_API_BASE_URL=https://your.api/api` in `.env`.
2. Set `VITE_USE_MOCK=false` in `.env`.
3. Implement the endpoints listed at the top of each service file:
   - `src/api/authService.js`
   - `src/api/usersService.js`
   - `src/api/coursesService.js`
   - `src/api/gradesService.js`
   - `src/api/notificationsService.js`
   - `src/api/dashboardService.js`

The `axiosClient` already:

- Attaches `Authorization: Bearer <token>` from `localStorage`.
- Unwraps `response.data` for you.
- Normalizes errors into `Error("message")`.

## 🧭 Routes

| Path                      | Page          |
| ------------------------- | ------------- |
| `/admin/login`            | Login         |
| `/admin/dashboard`        | Dashboard     |
| `/admin/users`            | Users         |
| `/admin/grades`           | Grades        |
| `/admin/courses`          | Courses       |
| `/admin/notifications`    | Notifications |
| `/admin/settings`         | Settings      |

## 🧪 Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview build

## 📦 Stack

React, React Router DOM, Tailwind CSS, Axios, Recharts, Lucide React, Vite.

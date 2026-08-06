# Luxora Jewel Hub

Luxury jewelry e-commerce — monorepo with two separate projects.

```
luxora-jewel-hub/
├── frontend/   Next.js 15 (App Router) + TypeScript + Tailwind v4 + Redux Toolkit
└── backend/    NestJS + TypeScript + MongoDB + JWT + Swagger
```

## Frontend

```bash
cd frontend
npm install
npm run dev      # http://localhost:3001 (backend runs on :3000)
npm run build    # next build (routes, sitemap.ts & robots.ts handled by the App Router)
npm start        # production server (http://localhost:3001 by default via `next start -p 3001`)
```

Notes:
- Environment: `.env` uses `NEXT_PUBLIC_API_URL` (backend base, e.g. `http://localhost:3000/api`) and `NEXT_PUBLIC_SITE_URL`.
- Routing uses the App Router under `src/app`; `src/lib/router.tsx` is a thin compat layer exposing
  the former react-router API (`Link`, `useNavigate`, `useLocation`, `useParams`, `useSearchParams`, …).
- Pages/components stay client components (Redux + RTK Query + localStorage).
- SEO is server-rendered: route-level `generateMetadata`/`metadata` in `src/app/**` (via `src/lib/seo-metadata.ts`) and dynamic `src/app/sitemap.ts` + `src/app/robots.ts`.

## Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET
npm run start:dev      # http://localhost:3000/api
                       # Swagger → http://localhost:3000/api/docs
```

## Git rules

- Do not force-push or rebase/amend/squash commits that are already pushed.
- Keep the main branch in a working state at all times.

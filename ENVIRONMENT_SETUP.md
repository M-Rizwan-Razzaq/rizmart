# Environment Setup

This repo has two separate apps:

- `frontend/` is the Next.js storefront.
- `backend/` is the NestJS API.

## Accounts You Need

- MongoDB Atlas account and cluster for `MONGO_URI`.
- Cloudflare account for frontend deployment and Cloudflare R2 storage.
- Email provider account for notifications.
  - Recommended: Resend.
  - Alternative: any SMTP provider such as Gmail, Mailgun, SendGrid, or Outlook SMTP.
- Domain/DNS account if you want a custom production URL.

## Backend Env Values

- `MONGO_URI`: MongoDB connection string from Atlas.
- `JWT_SECRET`: random secret you generate locally.
- `RESET_TOKEN_SECRET`: random secret you generate locally.
- `APP_URL`: your frontend URL, for example `http://localhost:3001` in dev or `https://your-store.com` in production.
- `SITE_URL`: public site URL used for sitemap and canonical links.
- `RESEND_API_KEY`: API key from Resend, if you use Resend.
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_SECURE`, `EMAIL_USER`, `EMAIL_PASS`: SMTP fallback settings if you do not use Resend.
- `EMAIL_FROM`, `EMAIL_FROM_ORDERS`, `EMAIL_FROM_OFFERS`: sender addresses.
- `ORDER_ADMIN_EMAIL`: inbox that receives order and contact notifications.
- `R2_BUCKET`, `R2_ENDPOINT`, `R2_PUBLIC_URL`, `R2_ACCESS_KEY`, `R2_SECRET_KEY`: Cloudflare R2 settings.

## Frontend Env Values

- `NEXT_PUBLIC_API_URL`: backend API base URL.
- `NEXT_PUBLIC_SITE_URL`: public storefront URL.

## What To Use Locally

- Backend:
  - `MONGO_URI=mongodb://localhost:27017/luxora`
  - `APP_URL=http://localhost:3001`
  - `SITE_URL=http://localhost:3001`
- Frontend:
  - `NEXT_PUBLIC_API_URL=http://localhost:3000/api`
  - `NEXT_PUBLIC_SITE_URL=http://localhost:3001`

## What To Use In Production

- Point `NEXT_PUBLIC_API_URL` to your deployed backend, for example `https://api.your-store.com/api`.
- Point `NEXT_PUBLIC_SITE_URL`, `APP_URL`, and `SITE_URL` to your public storefront domain, for example `https://your-store.com`.
- Add your Cloudflare R2 credentials if you want image uploads to use R2.
- Choose either Resend or SMTP for notifications.

## Important Notes

- The backend currently still serves local `/uploads` files for the product image route.
- The frontend root metadata still contains hardcoded old domain strings in `frontend/src/app/layout.tsx`.
- The backend CORS allowlist is hardcoded in `backend/src/main.ts`.
- If you change the production domain, those code paths may need a follow-up update in addition to the env files.

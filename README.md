# SecureGate

A secure authentication gateway for web applications. SecureGate provides registration, login, email verification, password reset, and protected routes — built with security-first defaults such as bcrypt password hashing, rate limiting, and enumeration-safe responses.

**Live demo:** [secure-gate-b0aksbepu-ab-001-uxs-projects.vercel.app](https://secure-gate-b0aksbepu-ab-001-uxs-projects.vercel.app)

Built as part of the **Design to MVP Bootcamp** by Abimbola Monsurat.

---

## Features

- **User registration** — Passwords hashed with bcrypt (salted) before storage
- **Credential login** — NextAuth.js with custom error handling for clear user feedback
- **Email verification** — Time-limited tokens (24 hours) sent via Resend
- **Password reset** — Secure reset flow with 1-hour token expiry
- **Protected dashboard** — Middleware blocks unauthenticated or unverified users
- **Rate limiting** — Brute-force protection on login and forgot-password endpoints (Upstash Redis)
- **Input validation** — Zod schemas for all auth forms and API routes
- **Fail-safe design** — Database transactions for signup; rate limiter fails open if Redis is unavailable

---

## Tech Stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Framework    | Next.js 14 (App Router), React 18   |
| Language     | TypeScript                          |
| Auth         | NextAuth.js (Credentials provider)  |
| Database     | PostgreSQL + Prisma                 |
| Email        | Resend                              |
| Rate limiting| Upstash Redis                       |
| Validation   | Zod                                 |

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- [Resend](https://resend.com) account (for transactional email)
- [Upstash Redis](https://upstash.com) (optional locally; recommended for production rate limiting)

### Installation

```bash
git clone https://github.com/Ab-001-UX/SecureGate.git
cd SecureGate
npm install
```

### Environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Required | Description |
| -------- | -------- | ----------- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | Session signing secret (`openssl rand -hex 32`) |
| `NEXTAUTH_URL` | Yes | App URL (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_APP_URL` | Yes | Public URL used in email links |
| `RESEND_API_KEY` | Yes | Resend API key |
| `SENDER_EMAIL` | Yes | Verified sender (e.g. `SecureGate <security@yourdomain.com>`) |
| `UPSTASH_REDIS_REST_URL` | No* | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | No* | Upstash Redis REST token |

\* Rate limiting is bypassed when Upstash is not configured (useful for local development).

### Database setup

```bash
npm run prisma:db-push
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:db-push` | Push schema to database |

---

## Project Structure

```
SecureGate/
├── prisma/
│   └── schema.prisma       # User, VerificationToken, PasswordResetToken models
├── src/
│   ├── app/
│   │   ├── api/auth/       # Register, verify, reset, NextAuth routes
│   │   ├── auth/           # Login, register, forgot/reset password pages
│   │   ├── dashboard/      # Protected user dashboard
│   │   └── page.tsx        # Landing page
│   ├── components/         # Shared UI (SignOutButton, providers)
│   ├── lib/
│   │   ├── auth.ts         # NextAuth configuration
│   │   ├── db.ts           # Prisma client
│   │   ├── email.ts        # Resend email sender
│   │   ├── email-templates.ts
│   │   ├── rate-limiter.ts # Upstash rate limiting
│   │   └── validation.ts   # Zod schemas
│   └── middleware.ts       # Dashboard route protection
└── REFLECTION.md           # Engineering analysis and design decisions
```

---

## Security Highlights

- **Password policy** — Minimum 8 characters with uppercase, lowercase, number, and special character
- **Enumeration protection** — Forgot-password returns the same response whether or not the email exists
- **Token expiry** — Verification tokens (24h) and reset tokens (1h) limit exposure windows
- **Rate limits** — 5 attempts per 10 minutes per IP on login and forgot-password (when Redis is configured)
- **Route guards** — `/dashboard` requires an authenticated session with a verified email

For a deeper write-up on trade-offs and engineering principles, see [REFLECTION.md](./REFLECTION.md).

---

## Deployment

The project is configured for [Vercel](https://vercel.com). Set all required environment variables in your Vercel project settings, connect a PostgreSQL database (e.g. Neon, Supabase), and deploy.

---

## Author

**Abimbola Monsurat** — Design to MVP Bootcamp

- GitHub: [Ab-001-UX/SecureGate](https://github.com/Ab-001-UX/SecureGate)

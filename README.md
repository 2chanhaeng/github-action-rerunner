# GitHub Action Rerunner

## Getting Started

```env
# DB (PostgreSQL)

DATABASE_URL=""
DIRECT_URL=""

# NextAuth.js
AUTH_SECRET="use `npx auth secret`"
AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""

# Token Encryption
ENCRYPTION_KEY="32 char"
```

### Dev server

```bash
pnpm install
npx prisma generate
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the
result.

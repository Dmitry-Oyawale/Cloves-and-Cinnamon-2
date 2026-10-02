This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Use Node.js 24.11 or newer on the Node 24 line and run `npm ci`.
Set `DATABASE_URL` in `.env` to your PostgreSQL connection string.

## Database (Prisma 8)

The app pins Prisma CLI `8.0.0-rc.19` and PostgreSQL runtime
`8.0.0-rc.13`. These release candidates share the rc.13 ORM toolchain;
runtime rc.14 is incompatible with this CLI's contract compiler.

- Edit models in `src/prisma/contract.prisma`.
- Import `{ db }` from `@/prisma/db` in server code.
- Run `npm run db:generate` after model edits. Development startup and
  production builds also emit the contract automatically.
- Commit `contract.json`, `contract.d.ts`, and the `migrations/` directory.

For example, in a Server Component or server action:

```ts
import { db } from "@/prisma/db";

const posts = await db.orm.public.Post.include("comments").all();
```

The upgrade preserves the existing `timestamp(3)` columns and cascade rules.
Timestamp values now use `Temporal.PlainDateTime`; the server client loads
the required polyfill. New post IDs use CUID2; existing IDs remain valid.
`updatedAt` retains its original creation-time default, not automatic updates.

The configured database has been adopted with `prisma db sign`.
`prisma/migrations/` is retained only as historical Prisma 7 SQL; active
Prisma 8 migrations live in `migrations/`, including a baseline for new databases.
For another existing database with these tables, run `npx prisma db sign`
before using Prisma 8 migrations. For a new empty database, run
`npm run db:migrate` to apply the baseline.

For future schema changes:

```bash
npm run db:generate
npm run db:plan -- --name describe_change
# Review the generated migration before applying it.
npm run db:migrate
```

`npm run db:verify` checks the database against the contract.
See the [Prisma 7 to 8 migration guide](https://www.prisma.io/docs/guides/upgrade-prisma-orm/postgresql).

## Development

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.s

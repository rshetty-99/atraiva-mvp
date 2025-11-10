This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

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

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Arcjet Protection

This project integrates [Arcjet](https://arcjet.com/) to provide bot mitigation, rate limiting, email validation, and Shield WAF coverage for server-side routes.

- Set `ARCJET_KEY` in `.env.local` with your site key and optionally `ARCJET_MODE` (`LIVE`, `DRY_RUN`, or `MONITOR`) to control enforcement.
- All `/api/*` routes run through Arcjet in middleware for Shield WAF, bot detection, and rate limiting.
- Member and organization creation endpoints call Arcjet's email validation to block disposable or invalid addresses before creating Clerk/Firestore records.
- The helper utilities live in `src/lib/arcjet/index.ts`; adjust the rule configuration there if you need different limits or bot allowances.

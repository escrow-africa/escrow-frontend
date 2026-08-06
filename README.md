# Escrow Africa — Frontend

This is the user-facing Next.js application for Escrow Africa. It provides the authentication flow, dashboard experience, wallet interactions, escrow management, and dispute-related views used by buyers and sellers.

## Overview

- Framework: Next.js 16 with React 19 and TypeScript
- Styling: Tailwind CSS and custom theme support
- State management: Zustand stores for auth and wallet state
- API layer: Axios client with token-based auth handling
- Charts and UI: Recharts, lucide-react, and custom dashboard components

## Project Structure

- [app/](app) — route-based pages such as sign-up, login, dashboard, and account views
- [components/](components) — reusable UI primitives and dashboard widgets
- [api/](api) — API wrappers for auth, escrow, and wallet endpoints
- [store/](store) — global state for authentication and wallet data
- [hooks/](hooks) — custom hooks such as dispute chat logic
- [utils/](utils) — helpers for token handling and related utilities
- [types/](types) — TypeScript models for domain entities

## Main Features

- User onboarding and authentication flow
- OTP-based verification and password reset flows
- Wallet funding and balance views
- Escrow dashboard and transaction history
- Dispute chat and moderation screens
- Light/dark theme support

## Environment Variables

Create a local environment file with the API base URL used by the frontend:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

## Available Scripts

```bash
npm run dev      # start the Next.js development server
npm run build    # create a production build
npm run start    # run the production build locally
npm run lint     # run ESLint checks
```

## Notes

- The app expects the backend gateway to be running so the API calls in [api/axios.ts](api/axios.ts) can reach the correct endpoints.
- Authentication tokens are stored in cookies using helpers from [utils/token.ts](utils/token.ts).

# HCAIRE Blog

Blog platform for the **Human Centered Artificial Intelligence Research Environment**.

## Overview

Monorepo with an Express/TypeScript API backend and a React/TypeScript frontend deployed on Cloudflare Pages. Content is stored in MongoDB Atlas and served via REST API. Authentication is handled by Clerk; subscriptions by Lemon Squeezy.

```
hcaire-blog/
├── server/   # Express API (Node.js + TypeScript) — port 3018
└── client/   # React SPA (Vite + TypeScript) — Cloudflare Pages
```

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Express.js, TypeScript, MongoDB Atlas, Mongoose |
| Auth | Clerk (`@clerk/express`) |
| Subscriptions | Lemon Squeezy + webhooks |
| Frontend | React 18, Vite, Tailwind CSS, Material UI |
| Hosting | Cloudflare Pages (client), custom server (backend) |
| Notifications | Telegram Bot, Redis Cloud pub/sub |

## Quick Start

```bash
npm install          # install all workspace dependencies
npm run dev          # start server (port 3018) + client (port 5173) concurrently
npm run build        # build both packages
```

### Environment setup

Copy and fill in the env files before starting:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

See [`server/README.md`](server/README.md) and [`client/README.md`](client/README.md) for the full list of required variables.

## Architecture

```
Browser → Cloudflare Pages (React SPA)
              ↓ REST API calls
         Express Server
              ↓
         MongoDB Atlas   (content, navigation, subscriptions)
         Clerk           (authentication, roles)
         Lemon Squeezy   (subscription billing)
         Redis Cloud     (pub/sub)
         Telegram Bot    (admin notifications)
```

### Access control

| Role | Access |
|---|---|
| Anonymous | Public content (`GET /api/contents`, `GET /api/navigation`) |
| Signed-in | Subscribed content |
| `admin` (Clerk metadata) | Admin dashboard, article requests, workflow logs |
